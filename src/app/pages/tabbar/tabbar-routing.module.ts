import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabbarPage } from './tabbar.page';

const routes: Routes = [
  {
    path: '',
    component: TabbarPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      // {
      //   path: 'races',
      //   loadChildren: () =>
      //     import('./../races/races.module').then((m) => m.RacesPageModule),
      // },
      // {
      //   path: 'news',
      //   loadChildren: () =>
      //     import('./../news/news.module').then((m) => m.NewsPageModule),
      // },
      // {
      //   path: 'timetable',
      //   loadChildren: () =>
      //     import('./../timetable/timetable.module').then(
      //       (m) => m.TimetablePageModule
      //     ),
      // },
      // {
      //   path: 'videos',
      //   loadChildren: () =>
      //     import('./../videos/videos.module').then((m) => m.VideosPageModule),
      // },
      // {
      //   path: 'store',
      //   loadChildren: () =>
      //     import('./../store/store.module').then((m) => m.StorePageModule),
      // },
      {
        path: 'home',
        loadChildren: () =>
          import('./../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'locator',
        loadChildren: () =>
          import('./../locators/locators.module').then(
            (m) => m.LocatorsPageModule
          ),
      },
      {
        path: 'chat-room',
        loadChildren: () =>
          import('./../chat-room/chat-room.module').then(
            (m) => m.ChatRoomPageModule
          ),
      },
      {
        path: 'equipment-reviews',
        loadChildren: () =>
          import('./../equipment-reviews/equipment-reviews.module').then(
            (m) => m.EquipmentReviewsPageModule
          ),
      },
      {
        path: 'store',
        loadChildren: () =>
          import('./../store/store.module').then((m) => m.StorePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabbarPageRoutingModule {}
