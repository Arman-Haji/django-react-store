from django.db.models import Count
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .filters import ProductFilter
from .models import Product, Category, Attribute, Banner
from .serializers import ProductListSerializer, ProductDetailSerializer, ProductWriteSerializer, CategorySerializer, AttributeWithValuesSerializer, AttributeSerializer, BannerSerializer

class ProductViewSet(viewsets.ModelViewSet):

    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter, 
    ]

    search_fields = [
        'name',
        'description',
        'category__name',
    ]

    ordering_fields = [
    'price',
    'created_at',
    'name',
    ]
    ordering = ['-created_at']

    filterset_class = ProductFilter
    def get_queryset(self):
        user = self.request.user
        qs = Product.objects.all()

        if not (user.is_authenticated and user.is_staff):
            qs = qs.filter(is_active=True)

        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):

        if self.action == 'list':
            return ProductListSerializer

        if self.action == 'retrieve':
            return ProductDetailSerializer

        if self.action in [
            'create',
            'update',
            'partial_update'
        ]:
            return ProductWriteSerializer

        return ProductDetailSerializer
    lookup_field = 'slug'

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        user = self.request.user
        qs = Category.objects.all().order_by('name')

        if not (user.is_authenticated and user.is_staff):
            qs = qs.filter(is_active=True)

        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

class AttributeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return AttributeSerializer
        return AttributeWithValuesSerializer

    def get_queryset(self):
        qs = Attribute.objects.all().order_by('name')
        category_slug = self.request.query_params.get('category')

        if category_slug and self.action == 'list':
            try:
                category = Category.objects.get(slug=category_slug)
            except Category.DoesNotExist:
                return qs.none()

            category_ids = self._get_all_category_ids(category)
            product_ids = Product.objects.filter(
                is_active=True,
                category_id__in=category_ids,
            ).values_list('id', flat=True)

            return qs.filter(
                product_attributes__product_id__in=product_ids
            ).distinct()

        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    def _get_all_category_ids(self, category):
        ids = [category.id]
        for child in Category.objects.filter(parent=category):
            ids.extend(self._get_all_category_ids(child))
        return ids


class BannerViewSet(viewsets.ModelViewSet):
    serializer_class = BannerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Banner.objects.all().order_by('order', '-created_at')


        if not (user.is_authenticated and user.is_staff):
            qs = qs.filter(is_active=True)

        group = self.request.query_params.get('group')
        if group:
            qs = qs.filter(group=group)

        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]