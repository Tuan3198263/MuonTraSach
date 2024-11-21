import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore'; // Import store để kiểm tra đăng nhập
import { useAdminAuthStore } from '../stores/useAdminAuthStore'; // Import store quản lý đăng nhập của admin
import Home from '../views/Home.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import AdminPage from '../views/admin/AdminPage.vue';
import NotFound from '../views/NotFound.vue';
import BookPage from '../components/admin/BookPage.vue';
import PublisherPage from '../components/admin/PuclisherPage.vue'
import ReaderPage from '../components/admin/ReaderPage.vue';
import BookLoanReturn from '../components/admin/BookLoanReturn.vue';
import AdminRegisterPage from '../views/admin/AdminRegisterPage.vue';
import AdminLoginPage from '../views/admin/AdminLoginPage.vue';
import Confirm from '../views/admin/Confirm.vue';
import Book from '../views/Book.vue';
import BookDetailPage from '../views/BookDetailPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import ProfileAdmin from '../components/admin/ProfileAdmin.vue';



const routes = [
   {
    path: "/",
    name: "Home",
    component: Home, // Use Home.vue as the default page
  },
   {
    path: "/login",
    name: "Login",
    component: LoginPage, // Trang đăng nhập
      
  
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/admin-register',
    name: 'AdminRegister',
    component: AdminRegisterPage,
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLoginPage,
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,
     children: [
      {
        path: 'books', // Sử dụng '/admin/books' để truy cập BookPage
        name: 'BookPage',
        component: BookPage,
      },
      {path: 'publishers',
        name: "PublisherPage",
        component: PublisherPage

      },
       {path: 'readers',
        name: "ReadersPage",
        component: ReaderPage

      },
      {path: 'book-loan',
        name: "BookLoanReturn",
        component: BookLoanReturn

      },
      {
    path: '/admin/profile',
    name: 'ProfileAdmin',
    component: ProfileAdmin,  // Trang hồ sơ admin
  },
    ],
    beforeEnter: (to, from, next) => {
    const adminAuthStore = useAdminAuthStore(); // Truy cập store đăng nhập admin
    if (!adminAuthStore.isAdminLoggedIn) { // Sử dụng isAdminLoggedIn để kiểm tra đăng nhập
      next({ name: 'AdminLogin' }); // Nếu admin chưa đăng nhập, chuyển hướng đến trang đăng nhập admin
    } else {
      next(); // Nếu đã đăng nhập, cho phép truy cập
    }
  }
  },

  {
    path: '/enter-password',
    name: 'Confirm',
    component: Confirm,
  },
  {
    path: '/book',
    name: 'Book',
    component: Book,
  },
  {
    path: "/book/:MaSach",
    name: "BookDetailPage",
    component: BookDetailPage,
  },
  {
    path: "/profile",
    name: "ProfilePage",
    component: ProfilePage,
  },
  // Route admin-login và các route khác
  // Các route khác
  // Route cho các đường dẫn không tồn tại
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
