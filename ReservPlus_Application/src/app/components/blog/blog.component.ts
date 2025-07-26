import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  
  blogPosts = [
    {
      id: 1,
      title: 'Comment optimiser votre planning de réservations',
      excerpt: 'Découvrez nos conseils pour organiser efficacement votre planning et maximiser votre productivité.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      author: 'Marie Dupont',
      date: '2024-01-15',
      category: 'Productivité',
      image: 'assets/images/blog/planning.jpg',
      readTime: '5 min',
      featured: true
    },
    {
      id: 2,
      title: 'Les tendances 2024 en matière de services',
      excerpt: 'Explorez les nouvelles tendances qui façonnent l\'industrie des services cette année.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'Jean Martin',
      date: '2024-01-10',
      category: 'Tendances',
      image: 'assets/images/blog/trends.jpg',
      readTime: '8 min',
      featured: false
    },
    {
      id: 3,
      title: 'Améliorer l\'expérience client en 5 étapes',
      excerpt: 'Des stratégies éprouvées pour offrir une expérience client exceptionnelle.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'Sophie Bernard',
      date: '2024-01-05',
      category: 'Service Client',
      image: 'assets/images/blog/customer-experience.jpg',
      readTime: '6 min',
      featured: false
    },
    {
      id: 4,
      title: 'Gestion des disponibilités : guide complet',
      excerpt: 'Un guide détaillé pour gérer efficacement vos disponibilités et optimiser votre planning.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'Pierre Dubois',
      date: '2024-01-01',
      category: 'Gestion',
      image: 'assets/images/blog/availability.jpg',
      readTime: '10 min',
      featured: false
    },
    {
      id: 5,
      title: 'Technologies émergentes dans la réservation',
      excerpt: 'Découvrez comment l\'IA et les nouvelles technologies révolutionnent la gestion des réservations.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'Lucie Moreau',
      date: '2023-12-28',
      category: 'Technologie',
      image: 'assets/images/blog/tech.jpg',
      readTime: '7 min',
      featured: false
    },
    {
      id: 6,
      title: 'Stratégies de fidélisation client',
      excerpt: 'Comment fidéliser vos clients et augmenter votre taux de rétention.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'Emma Rousseau',
      date: '2023-12-20',
      category: 'Marketing',
      image: 'assets/images/blog/loyalty.jpg',
      readTime: '9 min',
      featured: false
    }
  ];

  categories = [
    'Tous',
    'Productivité',
    'Tendances',
    'Service Client',
    'Gestion',
    'Technologie',
    'Marketing'
  ];

  selectedCategory = 'Tous';
  searchTerm = '';

  get filteredPosts() {
    let posts = this.blogPosts;
    
    if (this.selectedCategory !== 'Tous') {
      posts = posts.filter(post => post.category === this.selectedCategory);
    }
    
    if (this.searchTerm) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    return posts;
  }

  get featuredPosts() {
    return this.blogPosts.filter(post => post.featured);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  clearSearch() {
    this.searchTerm = '';
  }
} 