import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tarefa } from "../tarefa";
@Component({
 selector: 'app-item',
 templateUrl: './item.component.html',
 styleUrls: ['./item.component.css']
})
export class ItemComponent {
 emEdicao = false;
 @Input() tarefa: Tarefa = new Tarefa("", false);
 @Output() delete_tarefa = new EventEmitter<string>();
 @Output() modificaTarefa = new EventEmitter();

 DELETE_tarefa(descricao: string){
    this.delete_tarefa.emit(descricao)
 }

 UPDATE_tarefa(descricao: string){
   this.modificaTarefa.emit(descricao)
}
}
