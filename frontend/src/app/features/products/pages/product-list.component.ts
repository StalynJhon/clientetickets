import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importamos el servicio y la interfaz del producto
import { ProductsService, Product } from '../products.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  allProducts: any[] = []; // Usamos 'any' para evitar errores de tipado estricto por ahora
  filteredProducts: any[] = [];
  selectedProduct: any | null = null;
  isLoading: boolean = true;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        if (data && data.length > 0) {
          this.allProducts = data;
          this.filteredProducts = data;
        } else {
          this.usarDatosFalsos();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error backend, cargando falsos...', error);
        this.usarDatosFalsos();
        this.isLoading = false;
      }
    });
  }

  usarDatosFalsos() {
    const datos: any[] = [
      {
        id: '1',
        nameProduct: 'Combo Cine Pareja',
        priceProduct: 25.50,
        descriptionProduct: '2 Entradas + Canguil',
        imageProduct: 'https://cdn-icons-png.flaticon.com/512/3076/3076928.png'
      },
      {
        id: '2',
        nameProduct: 'Juguete de viento',
        priceProduct: 12.00,
        descriptionProduct: 'Edición Limitada',
        imageProduct: 'https://cdn-icons-png.flaticon.com/512/1858/1858066.png'
      },
      {
        id: '3',
        nameProduct: 'Pizza con Queso',
        priceProduct: 5.50,
        descriptionProduct: 'Con Queso extra',
        imageProduct: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png'
      },
      {
        id: '4',
        nameProduct: 'Juguete ',
        priceProduct: 25.50,
        descriptionProduct: '2 Entradas + Canguil',
        imageProduct: 'https://cdn-icons-png.flaticon.com/512/3076/3076928.png'
      },
      {
        id: '5',
        nameProduct: 'Vaso Marvel',
        priceProduct: 12.00,
        descriptionProduct: 'Edición Limitada',
        imageProduct: 'https://cdn-icons-png.flaticon.com/512/1858/1858066.png'
      },
      {
        id: '6',
        nameProduct: 'Hawaina Pizza',
        priceProduct: 5.50,
        descriptionProduct: 'Con Piña extra',
        imageProduct: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png'
      }
    ];
    this.allProducts = datos;
    this.filteredProducts = datos;
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredProducts = this.allProducts.filter(p =>
      p.nameProduct.toLowerCase().includes(term)
    );
  }

  openModal(product: any) { this.selectedProduct = product; }
  closeModal() { this.selectedProduct = null; }


  addToCart(product: any) {
    console.log('Agregando producto:', product);

    this.cartService.addToCart({
      id: String(product.id),

      nombre: product.nameProduct,
      precio: product.priceProduct,
      imagen: product.imageProduct,

      cantidad: 1,
      tipo: 'producto'
    });

    this.closeModal();
    alert('¡Producto agregado al carrito exitosamente!');
  }
}