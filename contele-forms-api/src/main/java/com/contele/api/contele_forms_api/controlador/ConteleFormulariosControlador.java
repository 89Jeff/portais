package com.contele.api.contele_forms_api.controlador;

import com.contele.api.contele_forms_api.modelo.RespostaFormulariosContele;
import com.contele.api.contele_forms_api.modelo.RespostaTemplatesFormulariosContele;
import com.contele.api.contele_forms_api.modelo.RespostaTarefasContele;
import com.contele.api.contele_forms_api.modelo.Tarefa;
import com.contele.api.contele_forms_api.servico.ClienteConteleFormulariosServico;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/contele")
public class ConteleFormulariosControlador {

    private final ClienteConteleFormulariosServico clienteConteleFormulariosServico;

    public ConteleFormulariosControlador(ClienteConteleFormulariosServico clienteConteleFormulariosServico) {
        this.clienteConteleFormulariosServico = clienteConteleFormulariosServico;
    }

    @GetMapping("/templates")
    public Mono<ResponseEntity<RespostaTemplatesFormulariosContele>> obterTemplatesFormularios() {
        return clienteConteleFormulariosServico.obterTemplatesFormularios()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/formularios/visita/{idDaVisita}")
    public Mono<ResponseEntity<RespostaFormulariosContele>> obterFormulariosPorVisita(@PathVariable String idDaVisita) {
        return clienteConteleFormulariosServico.obterFormulariosPorVisita(idDaVisita)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/tarefas")
    public Mono<ResponseEntity<RespostaTarefasContele>> obterTodasAsVisitas() {
        return clienteConteleFormulariosServico.obterTodasAsVisitas()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/tarefas/{taskId}")
    public Mono<ResponseEntity<Tarefa>> obterVisitaPorId(@PathVariable String taskId) {
        return clienteConteleFormulariosServico.obterVisitaPorId(taskId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    // Novo endpoint para buscar uma visita pelo número do pedido da Totvs no campo 'observation'
    @GetMapping("/tarefas/totvs/{numeroTotvs}")
    public Mono<ResponseEntity<Tarefa>> obterVisitaPorNumeroTotvs(@PathVariable String numeroTotvs) {
        return clienteConteleFormulariosServico.obterVisitaPorNumeroTotvs(numeroTotvs)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
