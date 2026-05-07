import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AppLayout } from './layout/app-layout/app-layout';
import { Play } from './features/play/play';
import { GuessSongsGuard } from './core/guards/guess-songs.guard';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: Home,
            },
            {
                path: 'play',
                component: Play,
                canActivate: [GuessSongsGuard],
            },
        ],
    },
];
