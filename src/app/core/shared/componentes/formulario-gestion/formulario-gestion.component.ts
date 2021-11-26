import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { decode } from 'querystring';
import { Analisis } from 'src/app/core/modelos/analisis';
import { DetalleProceso } from 'src/app/core/modelos/detalleProceso';
import { Documento } from 'src/app/core/modelos/documento';
import { DocumentoLista } from 'src/app/core/modelos/documentoLista';
import { DocumentoNuevo } from 'src/app/core/modelos/documentoNuevo';
import { MetadataProceso } from 'src/app/core/modelos/metadataProceso';
import { ObjetoCodigoValor } from 'src/app/core/modelos/objetoCodigoValor';
import { TareaDefinicion } from 'src/app/core/modelos/tareaDefinicion';
import { FormularioGestionService } from 'src/app/core/servicios/components/formulario-gestion.service';
import { AuthService } from 'src/app/core/servicios/http/auth.service';
import { DocumentosService } from 'src/app/core/servicios/http/documentos.service';
import { InboxService } from 'src/app/core/servicios/http/inbox.service';


@Component({
  selector: 'app-formulario-gestion',
  templateUrl: './formulario-gestion.component.html',
  styleUrls: ['./formulario-gestion.component.scss'],

})
export class FormularioGestionComponent implements OnInit, OnChanges {

  idUsuarioLoggeado: string;
  procesandoSeccion: string;
  cargandoDocumentos: boolean;
  metadata = new MetadataProceso();
  oDetalleProceso = new DetalleProceso();
  procesoActualizado =  new DetalleProceso();
  arrConsecuencias: ObjetoCodigoValor[] = [];

  xml:string = '';
  historialAnalisis: Analisis[];
  procesando = false;
  @Input() procesoSeleccionado: string | '';


  aseguradoVisible: boolean ;
  aseguradoEditable: boolean ;
  casoVisible: boolean;
  casoEditable: boolean ;
  siniestroVisible: boolean;
  siniestroEditable: boolean ;
  canalAtencionVisible: boolean;
  canalAtencionEditable: boolean ;
  pagoVisible: boolean;
  pagoEditable: boolean ;
  autorizanteVisible: boolean;
  autorizanteEditable: boolean ;
  objecionVisible: boolean;
  objecionEditable: boolean ;
  ajustadorVisible: boolean;
  ajustadorEditable: boolean ;
  idTareaDef:string;
  idTarea:string;
  tiposEvento: string[] = ['Evento 1', 'Evento 2'];
  pruebaDeVoz: string[] = ['No aplica','Riesgo Alto', 'Riesgo Bajo'];
  opcionesMotorDefinicion: string[] = ['Pendiente', 'Pagar', 'Objetado', 'Cambiar de línea'];
  lineasAtencion: string[] = ['Línea Ágil', 'Línea Tradicional', ' Línea Personalizada', 'Asistencia Bolivar'];

  casoForm = this.formBuilder.group({
    cambioMotorDef: [''],
    motivo: ['', Validators.required],
    pruebaDeVoz:[''],
    evidencia:['']
  });

  siniestroForm = this.formBuilder.group({
    tipoEvento: ['', Validators.required],
  });

  canalAtencionForm = this.formBuilder.group({
    cambioResponsable: ['', Validators.required],
    lineaAtencion: ['Línea Ágil',Validators.required],
    numeroStellent: ['']
  });

  ajustadorForm = this.formBuilder.group({
    ajustadorAsignado: ['', Validators.required],
    fechaAsignacion: ['',Validators.required],
    fechaEntrega: ['']
  });

  objecionForm = this.formBuilder.group({
    causa: ['', Validators.required],
    observacion: ['',Validators.required],
    fechaObjecion: ['',Validators.required]
  });

  pagoForm = this.formBuilder.group({
    concepto: ['', ],
    fechaActualizaEstFinan: ['',Validators.required],
  });

  nombreArchivo: string = '';
  archivo!:File;
  arrArchivos : File[] = [];
  urlDescarga: string = '';
  documentos:FormData;
  rutaDocumentoCargado: Documento[] = [];
  constructor(private activatedRoute: ActivatedRoute,
              private formularioGestionService:FormularioGestionService,
              private inboxService:InboxService,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private documentosService: DocumentosService,
              private formBuilder: FormBuilder) {

      this.idTareaDef = this.formularioGestionService.tareaDefinicion;
      this.idTarea = this.formularioGestionService.idTarea;

      this.idUsuarioLoggeado = this.authService.getLoggedInUserName();
      this.casoForm.reset();
      this.casoForm.controls.motivo.disable();

  }
  ngOnChanges(changes: SimpleChanges): void {

    if(this.procesoSeleccionado !=='' && this.procesoSeleccionado !==undefined){
      this.buscarDatos(this.procesoSeleccionado);
    }
  }

  ngOnInit(): void {
    console.log("Recarga Formulario");
    this.activatedRoute.params.subscribe((params)=>{
      console.log("*********" + params.idproceso);
      if(params.idproceso !== undefined){
        this.buscarDatos(params.idproceso)
      }
    });
  }

  buscarDatos(idProceso:string){
    this.restablecerVariables();
    this.idTareaDef = this.formularioGestionService.tareaDefinicion;
    this.idTarea = this.formularioGestionService.idTarea;
    console.log(this.idTarea);
    this.formularioGestionService.detalleProceso.idProceso= idProceso;
    this.procesoSeleccionado = idProceso;
    this.inboxService.getDatosProcesoDetalle(idProceso).subscribe(data => {
      if(data.tipoRespuesta == 'Exito'){
        this.xml = data.resultado?.xml;
        this.metadata = data.resultado.metadata;
        this.oDetalleProceso = data.resultado;
        this.historialAnalisis = data.resultado.historialAnalisis;
        this.oDetalleProceso.infoProducto.cobertura.forEach( item => {
          if (!this.arrConsecuencias.some( x => x.codigo === item.consecuenciaCob.codigo)) {
            this.arrConsecuencias.push(item.consecuenciaCob);
          }
        })
        console.log(this.oDetalleProceso);
        this.habilitarSeccion();
      }else{
        this.abrirSnackBar("Error obteniendo datos del formulario.");
      }
      this.procesando = false;
    });
  }

  onAgregarDocumento($event){
    this.arrArchivos = $event.target.files;
    console.log(this.arrArchivos)
    const fd = new FormData();
    Array.from(this.arrArchivos).forEach((file: File)  => {
      this.archivo = file;
      this.nombreArchivo = file.name //.replace(/ /g, '_');

      fd.append('file', this.archivo, this.nombreArchivo);
      console.log(fd.getAll);
       const doc = new DocumentoNuevo();

       doc.documentoBin.push(fd);

       this.documentos = fd;

     });
  }

  onCancelarCarga() {
    this.arrArchivos.splice;
    this.nombreArchivo = '';
  }

  onCargarDocumento(){
    this.cargandoDocumentos = true;
    this.documentosService.postCargaDocumento(this.procesoSeleccionado, this.oDetalleProceso.infoProceso.idConsecutivo, this.documentos).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta === "Exito") {
        this.rutaDocumentoCargado = this.oDetalleProceso.infoProceso.documentos.concat(data.resultado);
        this.oDetalleProceso.infoProceso.documentos = this.rutaDocumentoCargado;
        this.arrArchivos.splice;
        this.nombreArchivo = '';
        this.abrirSnackBar(data.mensaje);
      }else{
        this.abrirSnackBar(data.mensaje);
      }
      this.cargandoDocumentos = false;
    });
  }

  onConsultarDocumento(doc: Documento){
    this.documentosService.getUlrDescargaDocumento(doc.bucket, doc.route).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta === "Exito") {
        this.urlDescarga = data.resultado;
      //  window.open(this.urlDescarga, "_blank");
        const url = decodeURI(this.urlDescarga);
        // const url =  window.URL.createObjectURL(data.resultado);
        console.log(url);
        window.open(url, "_blank");

        // var uri_enc = encodeURI(this.urlDescarga);
        // var uri_dec = decode(this.urlDescarga);
        // var uri_dec2 = encodeURIComponent(uri_dec);
        // var res = uri_enc + "<br>" + uri_dec;
        // console.log(uri_enc)
        // console.log(uri_dec)
        // window.open(uri_dec, "_blank");
        // window.open(encodeURI(this.urlDescarga), "_blank");
        // var binary_string = window.atob(this.urlDescarga);
        // window.open(binary_string, "_blank");
      }else{
        this.abrirSnackBar(data.mensaje);
      }
    })
  }

  restablecerVariables(){
    this.casoVisible = true;
    this.casoEditable = false;
    this.siniestroVisible = true;
    this.siniestroEditable = false;
    this.canalAtencionVisible = true;
    this.canalAtencionEditable = false;
    this.pagoVisible = true;
    this.pagoEditable = false;
    this.autorizanteVisible = true;
    this.autorizanteEditable = false;
    this.objecionVisible = true;
    this.objecionEditable = false;
    this.ajustadorVisible = true;
    this.ajustadorEditable = false;
    this.procesando = true;
    this.historialAnalisis = null;
    this.casoForm.reset();
    this.casoForm.controls.motivo.disable();
  }

  onChangeCambioMotor($event){
    if($event.value){
      this.casoForm.controls.motivo.enable();
    }else{
      this.casoForm.controls.motivo.disable();
      this.casoForm.controls.motivo.setValue('');
    }
  }

  habilitarSeccion(){
    switch(this.idTareaDef) {
      case TareaDefinicion.ConceptoAnalisisCaso: {
        this.casoEditable = true;
        this.casoForm.controls.cambioMotorDef.setValue(this.oDetalleProceso.infoProceso?.cambioMotorDef?.valor);
        this.casoForm.controls.motivo.setValue(this.oDetalleProceso.infoProceso?.motivoCambioMotorDef);
        this.casoForm.controls.pruebaDeVoz.setValue(this.oDetalleProceso.infoProceso?.resultadoPruebaEstres);
        this.casoForm.controls.evidencia.setValue(this.oDetalleProceso.infoProceso?.resultadoEvidencia);
         break;
      }
      case TareaDefinicion.ActualizacionValorReserva: {
        this.siniestroEditable = true;
         break;
      }
      case TareaDefinicion.CreacionCasoStellent: {
        this.canalAtencionEditable = true;
        break;
      }
      case TareaDefinicion.ValidacionLiquidacion: {
        this.pagoEditable = true;
        break;
      }
      case TareaDefinicion.LevantamientoControlSimon: {
        this.autorizanteEditable = true;
        break;
      }
      case TareaDefinicion.ExplicacionCasoObjetado: {
        this.objecionEditable = true;
        break;
      }
      case TareaDefinicion.AnalisisCasoObjetado: {
        this.casoEditable = true;
        break;
      }
      case TareaDefinicion.AsignarAjustador: {
        this.ajustadorEditable = true;
        break;
      }
      case TareaDefinicion.SoloLecturaProcAbierto: {
        this.casoVisible = false;
        this.siniestroVisible = false;
        this.canalAtencionVisible = false;
        this.pagoVisible = false;
        this.autorizanteVisible = false;
        this.objecionVisible = false;
        this.ajustadorVisible = false;
        console.log(this.idTareaDef);
        console.log(this.casoVisible);
        break;
      }
      case TareaDefinicion.SoloLecturaProcFinalizado: {
        console.log(this.idTareaDef);
        console.log(this.casoVisible);
        break;
      }

      default: {
         //statements;
         break;
      }
   }
  }

  completaTareaCaso(){
    if (!this.casoForm.invalid) {
      this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
      // console.log(this.procesoActualizado.infoProceso);
      // console.log(this.oDetalleProceso.infoProceso);

      this.procesoActualizado.infoProceso.resultadoPruebaEstres = this.casoForm.value.pruebaDeVoz;
      this.procesoActualizado.infoProceso.resultadoEvidencia = this.casoForm.value.evidencia;
      this.procesoActualizado.infoProceso.fechaDesistimiento = this.casoForm.value.desistimiento;
      this.procesoActualizado.infoProceso.cambioMotorDef = new ObjetoCodigoValor('',this.casoForm.value.cambioMotorDef);
      this.procesoActualizado.infoProceso.motivoCambioMotorDef = this.casoForm.value.motivo;
      console.log(this.procesoActualizado.infoProceso);
      this.casoEditable = false;
      this.procesandoSeccion = 'casoEditable';
      this.inboxService.postCompletarTarea(this.idTarea, this.idTareaDef, this.idUsuarioLoggeado, this.procesoActualizado).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.formularioGestionService.setTareaCompletada(true);
          this.abrirSnackBar(data.mensaje);
        }else{
          this.casoEditable = true;
          this.abrirSnackBar(data.mensaje);
        }
        this.procesandoSeccion = '';
      });
    } else {
      this.abrirSnackBar("Debe diligenciar el motivo del cambio del motor de definición");
    }

  }

  completaTareaSiniestro(){
    console.log(this.siniestroForm.value);
    if (!this.siniestroForm.invalid) {
      this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
      this.procesoActualizado.siniestro = this.oDetalleProceso.siniestro;
      this.procesoActualizado.siniestro.tipoEvento = this.siniestroForm.value.tipoEvento;
      console.log(this.procesoActualizado);
      this.siniestroEditable = false;
      this.procesandoSeccion = 'siniestroEditable';
      this.inboxService.postCompletarTarea(this.idTarea, this.idTareaDef, this.idUsuarioLoggeado, this.procesoActualizado).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.formularioGestionService.setTareaCompletada(true);
          this.abrirSnackBar(data.mensaje);
        }else{
          this.siniestroEditable = true;
          this.abrirSnackBar(data.mensaje);
        }
        this.procesandoSeccion = '';
      });
    }else{
      this.abrirSnackBar("Debe seleccionar un Tipo de evento en el módulo Informacion del siniestro.");
    }
  }

  corregirActividad(){
    this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
    this.inboxService.postCorregirActividad( this.procesoActualizado).subscribe(data => {
      if (data.tipoRespuesta === "Exito") {
        this.abrirSnackBar(data.mensaje);
      }else{
        this.siniestroEditable = true;
        this.abrirSnackBar(data.mensaje);
      }
      this.procesandoSeccion = '';
    });
  }

  completaTareaCanalAtencion(){

    if(!this.canalAtencionForm.invalid){
      this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
      this.procesoActualizado.canalAtencion = this.oDetalleProceso.canalAtencion;
      console.log(this.procesoActualizado.canalAtencion);
      this.procesoActualizado.canalAtencion.cambioResponsable = this.canalAtencionForm.value.cambioResponsable;
      this.procesoActualizado.canalAtencion.lineaAtencion = this.canalAtencionForm.value.lineaAtencion;
      this.procesoActualizado.canalAtencion.casoStellent = this.canalAtencionForm.value.numeroStellent;
      console.log(this.procesoActualizado.canalAtencion);
      this.canalAtencionEditable = false;
      this.procesandoSeccion = 'canalAtencionEditable';
      this.inboxService.postCompletarTarea(this.idTarea, this.idTareaDef, this.idUsuarioLoggeado, this.procesoActualizado).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.formularioGestionService.setTareaCompletada(true);
          this.abrirSnackBar(data.mensaje);
        }else{
          this.siniestroEditable = true;
          this.abrirSnackBar(data.mensaje);
        }
        this.procesandoSeccion = '';
      });
    }else{
      this.abrirSnackBar("Debe rellenar todos los campos en rojo.");
    }
  }

  completaTareaAjustador(){

    console.log(this.ajustadorForm.value)
    if(!this.ajustadorForm.invalid){
      this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
      console.log(this.procesoActualizado);
      this.procesoActualizado.ajustador.asignado = this.ajustadorForm.value.ajustadorAsignado;
      this.procesoActualizado.ajustador.fechaAsignacion = this.ajustadorForm.value.fechaAsignacion;
      this.procesoActualizado.ajustador.fechaEntrega = this.ajustadorForm.value.fechaEntrega;
      console.log(this.procesoActualizado.ajustador);
      this.ajustadorEditable = false;
      this.procesandoSeccion = 'ajustadorEditable';
      this.inboxService.postCompletarTarea(this.idTarea, this.idTareaDef, this.idUsuarioLoggeado, this.procesoActualizado).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.formularioGestionService.setTareaCompletada(true);
          this.abrirSnackBar(data.mensaje);
        }else{
          this.ajustadorEditable = true;
          this.abrirSnackBar(data.mensaje);
        }
        this.procesandoSeccion = '';
      });
    }else{
      this.abrirSnackBar("Debe rellenar todos los campos en rojo.");
    }
  }

  completaTareaObjecion(){

    console.log(this.objecionForm.value)
    if(!this.objecionForm.invalid){
      this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
      console.log(this.procesoActualizado);
      this.procesoActualizado.objecion.causa = this.objecionForm.value.causa;
      this.procesoActualizado.objecion.observacion = this.objecionForm.value.observacion;
      this.procesoActualizado.objecion.fechaObjecion = this.objecionForm.value.fechaObjecion;
      console.log(this.procesoActualizado.objecion);
      this.objecionEditable = false;
      this.procesandoSeccion = 'objecionEditable';
      this.inboxService.postCompletarTarea(this.idTarea, this.idTareaDef, this.idUsuarioLoggeado, this.procesoActualizado).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.formularioGestionService.setTareaCompletada(true);
          this.abrirSnackBar(data.mensaje);
        }else{
          this.objecionEditable = true;
          this.abrirSnackBar(data.mensaje);
        }
        this.procesandoSeccion = '';
      });
    }else{
      this.abrirSnackBar("Debe rellenar todos los campos obligatorios (en rojo).");
    }
  }

  completaTareaPago(){

    console.log(this.pagoForm.value)
    if(!this.pagoForm.invalid){
      this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
      this.procesoActualizado.pago = this.oDetalleProceso.pago;
      console.log(this.procesoActualizado);
      this.procesoActualizado.pago.concepto = this.pagoForm.value.concepto;
      this.procesoActualizado.pago.fechaActualizaEstFinan = this.pagoForm.value.fechaActualizaEstFinan;
      console.log(this.procesoActualizado.pago);
      this.pagoEditable = false;
      this.procesandoSeccion = 'pagoEditable';
      this.inboxService.postCompletarTarea(this.idTarea, this.idTareaDef, this.idUsuarioLoggeado, this.procesoActualizado).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.formularioGestionService.setTareaCompletada(true);
          this.abrirSnackBar(data.mensaje);
        }else{
          this.pagoEditable = true;
          this.abrirSnackBar(data.mensaje);
        }
        this.procesandoSeccion = '';
      });
    }else{
      this.abrirSnackBar("Debe rellenar todos los campos obligatorios (en rojo).");
    }
  }

  completaTareaAutorizante(){

      this.procesoActualizado.infoProceso = this.oDetalleProceso.infoProceso;
      this.procesoActualizado.pago = this.oDetalleProceso?.pago;
      console.log(this.procesoActualizado);
      this.procesoActualizado.pago.autorizante =  this.idUsuarioLoggeado;
      this.procesoActualizado.pago.controlTecnico = "No";
      console.log(this.procesoActualizado.pago);
      this.autorizanteEditable = false;
      this.procesandoSeccion = 'autorizanteEditable';
      this.inboxService.postCompletarTarea(this.idTarea, this.idTareaDef, this.idUsuarioLoggeado, this.procesoActualizado).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.formularioGestionService.setTareaCompletada(true);
          this.abrirSnackBar(data.mensaje);
        }else{
          this.autorizanteEditable = true;
          this.abrirSnackBar(data.mensaje);
        }
        this.procesandoSeccion = '';
      });

  }


  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 10000;
    config.verticalPosition = "top";
    config.panelClass = ['red-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }

}
