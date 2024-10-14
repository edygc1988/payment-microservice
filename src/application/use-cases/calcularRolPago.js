class CalculatePayrol {
  constructor(rolPagoRepository) {
    this.rolPagoRepository = rolPagoRepository;
  }

  async execute(usuarioData, marcacionData) {
    let minutosTrabajados = 0;
    let minutosExtras50 = 0;
    let minutosExtras100 = 0;

    // Función auxiliar para formatear y validar la hora
    function formatearHora(hora) {
      const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!regex.test(hora)) {
        throw new Error("Formato de hora inválido: " + hora);
      }
      return hora;
    }

    // Función auxiliar para crear objetos Date correctamente
    function crearFecha(hora) {
      const [horaStr, minutoStr] = hora.split(":");
      const fecha = new Date(
        1970, 0, 1, parseInt(horaStr, 10), parseInt(minutoStr, 10), 0
      );
      return fecha;
    }

    // Función para distribuir minutos en categorías según la hora
    function distribuirMinutos(horaInicio, horaFin, totalMinutosTrabajados, totalMinutosExtras50, totalMinutosExtras100) {
      let inicio = crearFecha(horaInicio);
      let fin = crearFecha(horaFin);

      if (fin <= inicio) {
        fin.setDate(fin.getDate() + 1); // Avanzar al día siguiente si la hora de fin es menor o igual que la de inicio
      }

      while (inicio < fin) {
        const horaActual = inicio.getHours();
        const siguienteHora = new Date(inicio);
        siguienteHora.setHours(horaActual + 1, 0, 0, 0);

        if (siguienteHora > fin) {
          siguienteHora.setTime(fin.getTime());
        }

        const minutos = (siguienteHora - inicio) / 60000;

        if (horaActual >= 6 && horaActual < 24) {
          totalMinutosTrabajados += minutos;
        } else if (horaActual >= 0 && horaActual < 6) {
          totalMinutosExtras100 += minutos;
        } else {
          totalMinutosExtras50 += minutos;
        }

        inicio = siguienteHora;
      }

      return {
        totalMinutosTrabajados,
        totalMinutosExtras50,
        totalMinutosExtras100,
      };
    }

    try {
      // Procesar cada marcación del array
      for (const ingreso of marcacionData) {
        const ingresoHora = formatearHora(ingreso.horaInicio);
        const salidaComidaHora = formatearHora(ingreso.horaFin);
        const regresoComidaHora = formatearHora(ingreso.horaInicio1);
        const salidaFinalHora = formatearHora(ingreso.horaFin1);

        // Calcular minutos trabajados entre ingreso y salida a comer
        let resultado = distribuirMinutos(
          ingresoHora,
          salidaComidaHora,
          minutosTrabajados,
          minutosExtras50,
          minutosExtras100
        );
        minutosTrabajados = resultado.totalMinutosTrabajados;
        minutosExtras50 = resultado.totalMinutosExtras50;
        minutosExtras100 = resultado.totalMinutosExtras100;

        // Calcular minutos trabajados entre regreso de comida y salida final
        resultado = distribuirMinutos(
          regresoComidaHora,
          salidaFinalHora,
          minutosTrabajados,
          minutosExtras50,
          minutosExtras100
        );
        minutosTrabajados = resultado.totalMinutosTrabajados;
        minutosExtras50 = resultado.totalMinutosExtras50;
        minutosExtras100 = resultado.totalMinutosExtras100;
      }

      // Convertir minutos a horas
      let horasTrabajadas = minutosTrabajados / 60;
      let horasExtras50 = minutosExtras50 / 60;
      let horasExtras100 = minutosExtras100 / 60;

      const horasRegularesMax = 8;
      if (horasTrabajadas > horasRegularesMax) {
        const horasExtrasTotales = horasTrabajadas - horasRegularesMax;
        horasTrabajadas = horasRegularesMax;

        const totalExtras = horasExtras50 + horasExtras100;
        if (totalExtras > 0) {
          const factor50 = horasExtras50 / totalExtras;
          const factor100 = horasExtras100 / totalExtras;

          horasExtras50 = horasExtrasTotales * factor50;
          horasExtras100 = horasExtrasTotales * factor100;
        } else {
          horasExtras50 = 0;
          horasExtras100 = 0;
        }
      }

      usuarioData.horasTrabajadas = horasTrabajadas;
      usuarioData.horasExtras50 = horasExtras50;
      usuarioData.horasExtras100 = horasExtras100;

      const pagoHora = usuarioData.sueldo / 160; // Suponiendo 160 horas laborales al mes
      const pagoHorasRegulares = horasTrabajadas * pagoHora;
      const pagoHorasExtras50 = horasExtras50 * (pagoHora * 1.5);
      const pagoHorasExtras100 = horasExtras100 * (pagoHora * 2);

      usuarioData.pagoTotal = pagoHorasRegulares + pagoHorasExtras50 + pagoHorasExtras100;

      const rolPago = await this.rolPagoRepository.createPayrol({
        empleadoId: usuarioData.empleadoId,
        sueldo: usuarioData.sueldo,
        horasTrabajadas,
        horasExtras50,
        horasExtras100,
        pagoHorasRegulares,
        pagoHorasExtras50,
        pagoHorasExtras100,
        pagoTotal: usuarioData.pagoTotal,
        fechaPago: new Date().toISOString(),
        empresaId: usuarioData.empresaId,
        personaId: usuarioData.personaId,
        anio: usuarioData.year,
        mes: usuarioData.month
      });

      return rolPago;
    } catch (error) {
      console.error("Error en el cálculo del rol de pago:", error.message);
      throw error;
    }
  }
}

module.exports = CalculatePayrol;
