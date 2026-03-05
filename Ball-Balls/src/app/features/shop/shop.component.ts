import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ListPistasComponent } from "./components/list-pistas/list-pistas.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ListPistasComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent { }
