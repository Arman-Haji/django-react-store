from rest_framework import serializers
from .models import Category, Attribute, Product, ProductAttribute, Banner


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            'id',
            'name',
            'slug',
            'parent',
            'is_active',
            'products_count',
        )
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True},
            'parent': {'required': False, 'allow_null': True},
        }

    def get_products_count(self, obj):
        def get_all_category_ids(category):
            ids = [category.id]
            for child in Category.objects.filter(parent=category):
                ids.extend(get_all_category_ids(child))
            return ids

        category_ids = get_all_category_ids(obj)
        return Product.objects.filter(
            category_id__in=category_ids,
            is_active=True,
        ).count()


class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ('id', 'name', 'slug')
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True},
        }


class AttributeWithValuesSerializer(serializers.ModelSerializer):
    values = serializers.SerializerMethodField()

    class Meta:
        model = Attribute
        fields = ('id', 'name', 'slug', 'values')

    def get_values(self, obj):
        request = self.context.get('request')
        category_slug = request.query_params.get('category') if request else None

        qs = ProductAttribute.objects.filter(
            attribute=obj,
            product__is_active=True,
        )

        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug)
                category_ids = self._get_all_category_ids(category)
                qs = qs.filter(product__category_id__in=category_ids)
            except Category.DoesNotExist:
                pass

        return list(
            qs.values_list('value', flat=True)
            .distinct()
            .order_by('value')
        )

    def _get_all_category_ids(self, category):
        ids = [category.id]
        for child in Category.objects.filter(parent=category):
            ids.extend(self._get_all_category_ids(child))
        return ids


class ProductAttributeSerializer(serializers.ModelSerializer):
    attribute = AttributeSerializer(read_only=True)

    class Meta:
        model = ProductAttribute
        fields = ('attribute', 'value')


class ProductAttributeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ('attribute', 'value')


class ProductListSerializer(serializers.ModelSerializer):
    final_price = serializers.ReadOnlyField()
    has_discount = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True, default=None)

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'image',
            'price',
            'discount_price',
            'final_price',
            'has_discount',
            'stock',
            'is_active',
            'is_featured',
            'category',
            'category_name',
            'created_at',
        )


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    final_price = serializers.ReadOnlyField()
    has_discount = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'description',
            'category',
            'category_id',
            'image',
            'price',
            'discount_price',
            'final_price',
            'has_discount',
            'stock',
            'is_active',
            'is_featured',
            'attributes',
            'created_at',
            'updated_at',
        )


class ProductWriteSerializer(serializers.ModelSerializer):
    attributes = ProductAttributeCreateSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = (
            'name',
            'slug',
            'category',
            'description',
            'price',
            'discount_price',
            'stock',
            'image',
            'is_active',
            'is_featured',
            'attributes',
        )
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True},
            'image': {'required': False, 'allow_null': True},
            'discount_price': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_blank': True},
        }

    def validate(self, data):
        price = data.get('price', getattr(self.instance, 'price', None))
        discount_price = data.get('discount_price', getattr(self.instance, 'discount_price', None))

        if discount_price is not None and price is not None:
            if discount_price >= price:
                raise serializers.ValidationError({
                    'discount_price': 'Discount price must be lower than price.'
                })
        return data

    def create(self, validated_data):
        attributes_data = validated_data.pop('attributes', [])
        product = Product.objects.create(**validated_data)

        for item in attributes_data:
            ProductAttribute.objects.create(product=product, **item)

        return product

    def update(self, instance, validated_data):
        attributes_data = validated_data.pop('attributes', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if attributes_data is not None:
            instance.attributes.all().delete()
            for item in attributes_data:
                ProductAttribute.objects.create(product=instance, **item)

        return instance


class BannerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = (
            'id', 'title', 'image', 'image_url',
            'link', 'group', 'order', 'is_active',
        )
        extra_kwargs = {
            'image': {'required': False},
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url') and request:
            return request.build_absolute_uri(obj.image.url)
        return None