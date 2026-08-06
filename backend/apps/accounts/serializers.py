from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


def validate_unique(field_name, value, exclude_user=None, message=None):
    if not value:
        return value

    qs = User.objects.filter(**{field_name: value})
    if exclude_user:
        qs = qs.exclude(pk=exclude_user.pk)

    if qs.exists():
        default_messages = {
            'email': "This email is already registered.",
            'username': "This username is already taken.",
            'phone_number': "This phone number is already registered.",
        }
        raise serializers.ValidationError(message or default_messages.get(field_name, "This value is already used."))
    return value


def validate_email_or_phone(email, phone):
    if not email and not phone:
        raise serializers.ValidationError("At least one of email or phone number is required.")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'phone_number', 'password', 'password2')
        extra_kwargs = {
            'email': {'required': False, 'allow_null': True},
            'phone_number': {'required': False, 'allow_null': True},
        }

    def validate_email(self, value):
        return validate_unique('email', value)

    def validate_username(self, value):
        return validate_unique('username', value)

    def validate_phone_number(self, value):
        return validate_unique('phone_number', value)

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        validate_email_or_phone(attrs.get('email'), attrs.get('phone_number'))
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone_number',
            'first_name', 'last_name',
            'profile_image', 'profile_image_url', 'updated_at',
            'is_staff', 'is_superuser'
        ]
        read_only_fields = ['id', 'updated_at', 'profile_image_url', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'profile_image': {'required': False, 'allow_null': True},
            'email': {'required': False, 'allow_null': True},
            'phone_number': {'required': False, 'allow_null': True},
        }

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            return request.build_absolute_uri(obj.profile_image.url)
        return None

    def validate_username(self, value):
        return validate_unique('username', value, exclude_user=self.context['request'].user)

    def validate_email(self, value):
        return validate_unique('email', value, exclude_user=self.context['request'].user)

    def validate_phone_number(self, value):
        return validate_unique('phone_number', value, exclude_user=self.context['request'].user)

    def validate(self, attrs):
        email = attrs.get('email', self.instance.email if self.instance else None)
        phone = attrs.get('phone_number', self.instance.phone_number if self.instance else None)
        validate_email_or_phone(email, phone)
        return attrs

    def update(self, instance, validated_data):
        new_image = validated_data.get('profile_image')
        if new_image and instance.profile_image:
            instance.profile_image.delete(save=False)
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("The current password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "The new passwords do not match."})
        validate_password(attrs['new_password'], self.context['request'].user)
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['login'] = serializers.CharField()
        self.fields.pop('username', None)

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        user = User.objects.filter(
            Q(email__iexact=login) | Q(phone_number=login) | Q(username=login)
        ).first()

        if user is None:
            raise serializers.ValidationError("No user was found with these details.")

        authenticated_user = authenticate(username=user.username, password=password)

        if authenticated_user is None:
            raise serializers.ValidationError("The password is incorrect.")

        if not authenticated_user.is_active:
            raise serializers.ValidationError("The user account is inactive.")

        refresh = self.get_token(authenticated_user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': authenticated_user.id,
                'username': authenticated_user.username,
                'email': authenticated_user.email,
                'phone_number': authenticated_user.phone_number,
                'first_name': authenticated_user.first_name,
                'last_name': authenticated_user.last_name,
                'is_staff': authenticated_user.is_staff,
                'is_superuser': authenticated_user.is_superuser,
            }
        }