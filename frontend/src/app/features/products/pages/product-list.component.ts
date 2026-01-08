import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../products.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  allProducts: any[] = [];
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
      next: (data: any[]) => {
        if (data && data.length > 0) {
          this.allProducts = data;
          this.filteredProducts = data;
        } else {
          this.usarDatosFalsos();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos, usando datos demo...', error);
        this.usarDatosFalsos();
        this.isLoading = false;
      }
    });
  }

  // Datos de prueba
  usarDatosFalsos() {
    const datos = [
      {
        id: '1',
        nameProduct: 'Combo Cine Pareja',
        priceProduct: 25.50,
        descriptionProduct: '2 Entradas + Canguil Grande + 2 Bebidas',
        imageProduct: 'https://blob.tusbuenasnoticias.com/images/2025/02/14/fin-de-semana-de-san-valentin-en-cinepolis--combos-para-pareja-precio-y-que-traen_1-focus-0-0-1200-600.webp'
      },
      {
        id: '2',
        nameProduct: 'Vaso Coleccionable',
        priceProduct: 12.00,
        descriptionProduct: 'Edición Limitada Marvel/DC',
        imageProduct: 'https://tse4.mm.bing.net/th/id/OIP.yCqTLysGy0sxGdzrHcKQ8gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: '3',
        nameProduct: 'Pizza Personal',
        priceProduct: 5.50,
        descriptionProduct: 'Masa crujiente con extra queso',
        imageProduct: 'https://realplaza.vtexassets.com/arquivos/ids/31681180/image-0483833b6fd04168b8295f469a31a8c7.jpg?v=638119011367230000'
      },
      {
        id: '4',
        nameProduct: 'Nachos con Queso',
        priceProduct: 8.50,
        descriptionProduct: 'Con jalapeños y salsa de queso cheddar',
        imageProduct: 'https://tse3.mm.bing.net/th/id/OIP.QoL0k3GUMBbvu6kOKIfDoAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: '5',
        nameProduct: 'Hot Dog Premium',
        priceProduct: 6.50,
        descriptionProduct: 'Salchicha jumbo americana, salsas al gusto y papas hilo.',
        imageProduct: 'https://images.rappi.com.mx/products/66fecc49-bd2b-4e40-9654-993123ffc23e-1644343561384.png'
      },
      {
        id: '6',
        nameProduct: 'Granizado ICEE Azul',
        priceProduct: 4.75,
        descriptionProduct: 'Bebida congelada sabor frambuesa azul. 24oz.',
        imageProduct: 'https://tse1.mm.bing.net/th/id/OIP.xJIsc-mlP-MZFITsPDiMZQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: '7',
        nameProduct: 'Pack M&Ms Chocolate',
        priceProduct: 3.50,
        descriptionProduct: 'Bolsa para compartir de chocolate con leche.',
        imageProduct: 'https://hebmx.vtexassets.com/arquivos/ids/749545-800-800?v=638789353312100000&width=800&height=800&aspect=true'
      },
      {
        id: '8',
        nameProduct: 'Nuggets de Pollo (6 u)',
        priceProduct: 7.00,
        descriptionProduct: 'Crujientes trozos de pechuga con salsa BBQ.',
        imageProduct: 'https://tse1.mm.bing.net/th/id/OIP.aYrB4n0h0LW9k9FqzNzhQgHaES?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: '9',
        nameProduct: 'Canguil Dulce Caramelo',
        priceProduct: 6.00,
        descriptionProduct: 'Palomitas bañadas en caramelo crujiente artesanal.',
        imageProduct: 'https://img.freepik.com/fotos-premium/cuenco-deliciosas-palomitas-caramelo-hechas-casa-palomitas-maiz-caramelo-fresco-sabor-caramelo-dulce_335738-1.jpg'
      },
      {
        id: '10',
        nameProduct: 'Vaso Iron Man con Luz LED',
        priceProduct: 15.50,
        descriptionProduct: 'Vaso edición Avengers con ojos que se iluminan (Incluye bebida).',
        imageProduct: 'https://tse3.mm.bing.net/th/id/OIP.G62UeWxy1h0yWoB-EAMHjgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' // Nota: Si falla, busca "Iron Man Cup Cinema"
      },
      {
        id: '11',
        nameProduct: 'Peluche Grogu (Baby Yoda)',
        priceProduct: 22.00,
        descriptionProduct: 'Suave peluche de "The Mandalorian" de 25cm. Producto Oficial Disney+.',
        imageProduct: 'https://elenanofriki.com/18647-thickbox_default/peluche-grogu-baby-yoda-extra-suave-25-cm-the-mandalorian.jpg'
      },
      {
        id: '12',
        nameProduct: 'Camiseta Hellfire Club',
        priceProduct: 18.00,
        descriptionProduct: 'Camiseta unisex de Stranger Things, mangas 3/4 estilo béisbol.',
        imageProduct: 'https://tse1.mm.bing.net/th/id/OIP.ivSAAhZwptYpe5vhOpi4KgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: '13',
        nameProduct: 'Palomera Jurassic World T-Rex',
        priceProduct: 30.00,
        descriptionProduct: 'Cabeza de T-Rex con boca articulada para guardar tus palomitas.',
        imageProduct: 'https://tse3.mm.bing.net/th/id/OIP.iBWDvu3pJyA2AXX8MzO4-QHaLN?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: '14',
        nameProduct: 'Llavero Claqueta de Cine',
        priceProduct: 4.50,
        descriptionProduct: 'Recuerdo clásico de Hollywood, funcional con sonido "Clap".',
        imageProduct: 'https://http2.mlstatic.com/D_NQ_NP_877254-MLC54293779140_032023-O.webp'
      },
      {
        id: '15',
        nameProduct: 'Funko Pop! Spider-Man',
        priceProduct: 14.99,
        descriptionProduct: 'Figura de vinilo edición "No Way Home" con traje integrado.',
        imageProduct: 'https://tse4.mm.bing.net/th/id/OIP.ZeYGPXwI4g0rvpOqf4SnagHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: '16',
        nameProduct: 'Vaso Katana Demon Slayer',
        priceProduct: 16.00,
        descriptionProduct: 'Vaso temático con popote en forma de la espada de Tanjiro.',
        imageProduct: 'https://i.ytimg.com/vi/WvgsuZesvHQ/maxresdefault.jpg'
      },
      {
        id: '17',
        nameProduct: 'Manta Gryffindor Harry Potter',
        priceProduct: 25.00,
        descriptionProduct: 'Manta polar suave con el escudo de la casa Gryffindor.',
        imageProduct: 'https://http2.mlstatic.com/D_NQ_NP_852137-MCO72692591081_112023-O.webp'
      }

    ];
    this.allProducts = datos;
    this.filteredProducts = datos;
  }

  // Funcionalidad del Buscador
  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredProducts = this.allProducts.filter(p =>
      p.nameProduct.toLowerCase().includes(term)
    );
  }

  // Lógica del Modal
  openModal(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  // Agregar al Carrito
  addToCart(product: any) {
    this.cartService.addToCart({
      id: String(product.id),
      nombre: product.nameProduct,
      precio: product.priceProduct,
      imagen: product.imageProduct,
      cantidad: 1,
      tipo: 'producto'
    });

    // Cerramos el modal si estaba abierto
    if (this.selectedProduct) {
      this.closeModal();
    }
  }
}