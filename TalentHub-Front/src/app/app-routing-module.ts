import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ OffreList } from './component/offre-list/offre-list';

const routes: Routes =[
  { path: '', redirectTo: '/offre',pathMatch: 'full' },
  { path: 'offre', component: OffreList },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
