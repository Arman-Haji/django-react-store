from django.contrib import admin

from .models import Category, Attribute, Product, ProductAttribute
from .forms import ProductAdminForm

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'parent',
        'is_active',
        'created_at',
    )

    list_filter = ('is_active',)

    search_fields = ('name',)

    prepopulated_fields = {
        'slug': ('name',)
    }

@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'slug',
    )

    search_fields = ('name',)

    prepopulated_fields = {
        'slug': ('name',)
    }

class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 1

    autocomplete_fields = ('attribute',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    form = ProductAdminForm

    inlines = [
        ProductAttributeInline,
    ]

    autocomplete_fields = ('category',)

    def final_price_display(self, obj):
        return obj.final_price

    final_price_display.short_description = "Final Price"


    def has_discount_display(self, obj):
        return obj.has_discount

    has_discount_display.short_description = "Has Discount"

    list_display = (
        'name',
        'category',
        'price',
        'discount_price',
        'final_price_display',
        'has_discount_display',
        'stock',
        'is_active',
    )

    list_filter = (
        'category',
        'is_active',
        'is_featured',
    )

    search_fields = (
        'name',
        'description',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }

    readonly_fields = (
        'created_at',
        'updated_at',
    )

