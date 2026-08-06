# products/filters.py
import django_filters
from django.db.models import Q
from .models import Product, Category, ProductAttribute


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(method='filter_category')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    has_discount = django_filters.BooleanFilter(method='filter_has_discount')

    class Meta:
        model = Product
        fields = ['category', 'min_price', 'max_price']

    def filter_category(self, queryset, name, value):
        if not value:
            return queryset

        try:
            category = Category.objects.get(slug=value)
        except Category.DoesNotExist:
            return queryset.none()

        # خود دسته + همه بچه‌ها (و نوه‌ها اگر چند سطح باشه)
        category_ids = self._get_descendant_ids(category)
        return queryset.filter(category_id__in=category_ids)

    def _get_descendant_ids(self, category):
        """آیدی خود دسته + همه زیردسته‌ها به صورت بازگشتی"""
        ids = [category.id]
        children = Category.objects.filter(parent=category)

        for child in children:
            ids.extend(self._get_descendant_ids(child))

        return ids

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset

    def filter_has_discount(self, queryset, name, value):
        if value:
            return queryset.filter(discount_price__isnull=False)
        return queryset

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        # Attribute filters
        for key, value in self.data.items():
            if key.startswith('attr_') and value:
                attr_slug = key.replace('attr_', '')
                values = [v.strip() for v in value.split(',') if v.strip()]

                for val in values:
                    queryset = queryset.filter(
                        attributes__attribute__slug=attr_slug,
                        attributes__value__iexact=val
                    )

        return queryset.distinct()