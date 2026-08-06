from rest_framework.routers import DefaultRouter

from .views import ProductViewSet, CategoryViewSet, AttributeViewSet


router = DefaultRouter()

router.register('products', ProductViewSet, basename='products')
router.register('categories', CategoryViewSet, basename='categories')
router.register('attributes', AttributeViewSet, basename='attribute')


urlpatterns = router.urls