import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AppLayout } from './layout/app-layout/app-layout';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: Home,
            },
        ],
    },
];
