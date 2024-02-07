import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./splash/splash.module').then((m) => m.SplashPageModule),
  },

  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'tabbar',
    loadChildren: () =>
      import('./tabbar/tabbar.module').then((m) => m.TabbarPageModule),
  },
  {
    path: 'locators',
    loadChildren: () =>
      import('./locators/locators.module').then((m) => m.LocatorsPageModule),
  },
  {
    path: 'hunter-branches',
    loadChildren: () =>
      import('./hunter-branches/hunter-branches.module').then(
        (m) => m.HunterBranchesPageModule
      ),
  },
  {
    path: 'chat-room',
    loadChildren: () =>
      import('./chat-room/chat-room.module').then((m) => m.ChatRoomPageModule),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'equipment-reviews',
    loadChildren: () =>
      import('./equipment-reviews/equipment-reviews.module').then(
        (m) => m.EquipmentReviewsPageModule
      ),
  },
  {
    path: 'store',
    loadChildren: () =>
      import('./store/store.module').then((m) => m.StorePageModule),
  },
  {
    path: 'camp-fire',
    loadChildren: () =>
      import('./camp-fire/camp-fire.module').then((m) => m.CampFirePageModule),
  },
  {
    path: 'taxidermy-processing',
    loadChildren: () =>
      import('./taxidermy-processing/taxidermy-processing.module').then(
        (m) => m.TaxidermyProcessingPageModule
      ),
  },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesPageModule),
  },
  {
    path: 'post-adventure',
    loadChildren: () =>
      import('./post-adventure/post-adventure.module').then(
        (m) => m.PostAdventurePageModule
      ),
  },
  {
    path: 'outfitters',
    loadChildren: () =>
      import('./outfitters/outfitters.module').then(
        (m) => m.OutfittersPageModule
      ),
  },
  {
    path: 'dating',
    loadChildren: () =>
      import('./dating/dating.module').then((m) => m.DatingPageModule),
  },
  {
    path: 'nationwide-laws',
    loadChildren: () =>
      import('./nationwide-laws/nationwide-laws.module').then(
        (m) => m.NationwideLawsPageModule
      ),
  },
  {
    path: 'tie-a-lure',
    loadChildren: () =>
      import('./tie-a-lure/tie-a-lure.module').then(
        (m) => m.TieALurePageModule
      ),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      ),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./support/support.module').then((m) => m.SupportPageModule),
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./about-us/about-us.module').then((m) => m.AboutUsPageModule),
  },
  {
    path: 'terms-conditions',
    loadChildren: () =>
      import('./terms-conditions/terms-conditions.module').then(
        (m) => m.TermsConditionsPageModule
      ),
  },
  {
    path: 'web-view',
    loadChildren: () =>
      import('./web-view/web-view.module').then((m) => m.WebViewPageModule),
  },
  {
    path: 'selection',
    loadChildren: () =>
      import('./selection/selection.module').then((m) => m.SelectionPageModule),
  },
  {
    path: 'post-adventure-content',
    loadChildren: () =>
      import('./post-adventure-content/post-adventure-content.module').then(
        (m) => m.PostAdventureContentPageModule
      ),
  },
  {
    path: 'equipment-reviews-list',
    loadChildren: () =>
      import('./equipment-reviews-list/equipment-reviews-list.module').then(
        (m) => m.EquipmentReviewsListPageModule
      ),
  },
  {
    path: 'chat-rooms',
    loadChildren: () =>
      import('./chat-rooms/chat-rooms.module').then(
        (m) => m.ChatRoomsPageModule
      ),
  },
  {
    path: 'ranch-locator',
    loadChildren: () => import('./ranch-locator/ranch-locator.module').then( m => m.RanchLocatorPageModule)
  },
  {
    path: 'taxidermy',
    loadChildren: () => import('./taxidermy/taxidermy.module').then( m => m.TaxidermyPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'billing-address',
    loadChildren: () => import('./billing-address/billing-address.module').then( m => m.BillingAddressPageModule)
  },
  {
    path: 'how-to',
    loadChildren: () => import('./how-to/how-to.module').then( m => m.HowToPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then( m => m.SubscriptionPageModule)
  },
  // {
  //   path: 'stripe-payment',
  //   loadChildren: () => import('./stripe-payment/stripe-payment.module').then( m => m.StripePaymentPageModule)
  // },
  {
    path: 'marketplace',
    loadChildren: () => import('./marketplace/marketplace.module').then( m => m.MarketplacePageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'apple-wallet',
    loadChildren: () => import('./apple-wallet/apple-wallet.module').then( m => m.AppleWalletPageModule)
  },

  {
    path: 'create-listing',
    loadChildren: () => import('./marketplace/create-listing/create-listing.module').then( m => m.CreateListingPageModule)
  },
  {
    path: 'blocked-users',
    loadChildren: () => import('./blocked-users/blocked-users.module').then( m => m.BlockedUsersPageModule)
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./my-orders/my-orders.module').then( m => m.MyOrdersPageModule)
  },
  {
    path: 'hiking',
    loadChildren: () => import('./hiking/hiking.module').then( m => m.HikingPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'otp-submit',
    loadChildren: () => import('./otp-submit/otp-submit.module').then( m => m.OtpSubmitPageModule)
  },
  {
    path: 'conversations',
    loadChildren: () => import('./conversations/conversations.module').then( m => m.ConversationsPageModule)
  },
  // {
  //   path: 'test',
  //   loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  // },
  {
    path: 'broadcast-message',
    loadChildren: () => import('./broadcast-message/broadcast-message.module').then( m => m.BroadcastMessagePageModule)
  },


  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
