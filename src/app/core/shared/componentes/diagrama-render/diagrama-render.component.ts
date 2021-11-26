import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  OnInit
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import BpmnJS from 'bpmn-js/lib/Modeler';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */

//import * as BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.development.js';
//import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
//import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import { from, Observable, Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { InboxService } from 'src/app/core/servicios/http/inbox.service';


@Component({
  selector: 'app-diagrama-render',
  templateUrl: './diagrama-render.component.html',
  styleUrls: ['./diagrama-render.component.scss']
})
export class DiagramaRenderComponent implements AfterContentInit, OnInit, OnChanges {

  private bpmnJS: BpmnJS;
  overlays: any;
  canvas: any;
  elementRegistry: any;
  modeling: any;
  @ViewChild('ref', { static: true })
  private el!: ElementRef;
  //@Output() private importDone: EventEmitter<any> = new EventEmitter();

  diagramUrl: string;
  xml:string;

  @Input() idProceso: string;
  @Input() diagramaXml: string;


  constructor(private http: HttpClient, private inboxService:InboxService, private activatedRoute: ActivatedRoute, ) {

    this.bpmnJS = new BpmnJS();
    this.overlays = this.bpmnJS.get('overlays'),
    this.canvas = this.bpmnJS.get('canvas'),
    this.elementRegistry = this.bpmnJS.get('elementRegistry'),
    this.modeling = this.bpmnJS.get('modeling');
    //this.diagramUrl = '/assets/diagrama/IndemnizacionesGenerales.bpmn20.xml';

  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
    //console.log(this.loadUrl(this.diagramUrl));
    //console.log(this.diagramaXml);
    //console.log(this.loadXML());
    //this.loadXML();

  }

  ngOnInit(){
    //console.log(this.diagramaXml);
  }

  ngOnChanges(changes: SimpleChanges){
    this.bpmnJS.attachTo(this.el.nativeElement);
    //console.log('cambio' + this.diagramaXml)
    if (this.diagramaXml) {
      this.loadXML();
    }


  }

  cambioColor(){
    //this.canvas.zoom('fit-viewport');
    //console.log(this.idProceso);
    if(this.idProceso!==''){
      let arrElementosCompletos =[];
      let arrElementosPendientes = [];
      let elementoColorCompleto =[];
      let elementoColorPendiente =[];
      this.inboxService.getRutaDelProceso(this.idProceso).subscribe(data =>{
        //console.log(data.listaResultado);

        data.listaResultado.forEach(element => {
          if(element.fechaFin != null){
            arrElementosCompletos.push(element.idActividad);
          }else{
            arrElementosPendientes.push(element.idActividad);
          }
        });

        if (arrElementosCompletos.length>0) {
          arrElementosCompletos.forEach(element => {
            elementoColorCompleto.push(this.elementRegistry.get(element));
          });
        }

        if (arrElementosPendientes.length>0) {
          arrElementosPendientes.forEach(element => {
            elementoColorPendiente.push(this.elementRegistry.get(element));
          });
        }

        if (elementoColorCompleto.length>0) {
          console.log(elementoColorCompleto);
          this.modeling.setColor( elementoColorCompleto , {
            stroke: 'green',
            fill: 'palegreen'
          });

          elementoColorCompleto =[];
        }

        if (elementoColorPendiente.length>0) {
          console.log(elementoColorPendiente);
          this.modeling.setColor( elementoColorPendiente , {
            stroke: 'black',
            fill: 'pink'
          });
          console.log(elementoColorPendiente);
          elementoColorPendiente =[];
        }
      });
    }
  }

  /**
   * Load diagram from URL and emit completion event
   */
   loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(

      )
    );
  }

  loadXML(): Subscription {

      return this.importDiagram(this.diagramaXml).subscribe();

  }




  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    //console.log(xml);
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }
}
