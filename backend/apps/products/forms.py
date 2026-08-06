from django import forms

from .models import Product


class ProductAdminForm(forms.ModelForm):

    class Meta:
        model = Product
        fields = '__all__'


    def clean(self):
        cleaned_data = super().clean()

        price = cleaned_data.get('price')
        discount_price = cleaned_data.get('discount_price')

        if discount_price and price:
            if discount_price >= price:
                raise forms.ValidationError(
                    "Discount price must be lower than price."
                )

        return cleaned_data