import json
import os
from django.conf import settings

from django.core.management.base import BaseCommand

from apps.products.models import Category, Attribute, Product, ProductAttribute


class Command(BaseCommand):

    help = "Create test products data"


    def handle(self, *args, **kwargs):

        base_path = os.path.join(
            settings.BASE_DIR,
            "apps",
            "products",
            "fixtures"
        )


        # Categories
        with open(
            os.path.join(base_path, "categories.json"),
            encoding="utf-8"
        ) as file:

            categories = json.load(file)


        for item in categories:

            parent = None

            if item.get("parent"):
                parent = Category.objects.get(
                    name=item["parent"]
                )


            Category.objects.get_or_create(
                name=item["name"],
                defaults={
                    "slug": item["slug"],
                    "parent": parent
                }
            )


        self.stdout.write(
            self.style.SUCCESS(
                "Categories created"
            )
        )



        # Attributes
        with open(
            os.path.join(base_path, "attributes.json"),
            encoding="utf-8"
        ) as file:

            attributes = json.load(file)


        for item in attributes:

            Attribute.objects.get_or_create(
                name=item["name"],
                defaults={
                    "slug": item["slug"]
                }
            )


        self.stdout.write(
            self.style.SUCCESS(
                "Attributes created"
            )
        )



        # Products
        with open(
            os.path.join(base_path, "products.json"),
            encoding="utf-8"
        ) as file:

            products = json.load(file)



        for item in products:


            category = Category.objects.get(
                name=item["category"]
            )


            product, created = Product.objects.get_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "category": category,
                    "description": item["description"],
                    "price": item["price"],
                    "discount_price": item["discount_price"],
                    "stock": item["stock"],
                    "is_featured": item["is_featured"],
                }
            )


            for attr in item["attributes"]:

                attribute = Attribute.objects.get(
                    name=attr["attribute"]
                )


                ProductAttribute.objects.get_or_create(
                    product=product,
                    attribute=attribute,
                    defaults={
                        "value": attr["value"]
                    }
                )



        self.stdout.write(
            self.style.SUCCESS(
                "Products created successfully"
            )
        )