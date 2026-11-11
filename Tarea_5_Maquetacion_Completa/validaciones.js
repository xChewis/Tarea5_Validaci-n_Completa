

document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('registro');
  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const dia = document.getElementById('dia');
  const mes = document.getElementById('mes');
  const anio = document.getElementById('anio');
  const mensaje = document.getElementById('mensaje-formulario');
  const radiosSexo = formulario.querySelectorAll('input[name="sexo"]');

  // La validación se controla desde JavaScript y muestra mensajes propios.
  formulario.noValidate = true;

  // Mostrar los años desde el actual hasta hace 110 años.
  const anioActual = new Date().getFullYear();
  for (let numero = anioActual; numero >= anioActual - 110; numero--) {
    anio.add(new Option(numero, numero));
  }

  // Construir días válidos para el mes y año escogidos (incluye años bisiestos).
  function actualizarDias() {
    const diaAnterior = dia.value;
    let totalDias = 31;

    if (mes.value) {
      const numeroMes = Number(mes.value);
      const numeroAnio = anio.value ? Number(anio.value) : 2000;
      totalDias = new Date(numeroAnio, numeroMes, 0).getDate();
    }

    dia.innerHTML = '<option value="">día</option>';
    for (let numero = 1; numero <= totalDias; numero++) {
      dia.add(new Option(numero, numero));
    }
    if (diaAnterior && Number(diaAnterior) <= totalDias) {
      dia.value = diaAnterior;
    }
  }

  actualizarDias();
  mes.addEventListener('change', actualizarDias);
  anio.addEventListener('change', actualizarDias);

  function mostrarError(texto, campo) {
    mensaje.textContent = texto;
    mensaje.classList.add('error');
    campo.setAttribute('aria-invalid', 'true');
    campo.focus();
  }

  // Quitar el estado de error cuando el usuario corrige un campo.
  formulario.querySelectorAll('input, select').forEach(function (campo) {
    campo.addEventListener('input', function () {
      campo.removeAttribute('aria-invalid');
      mensaje.textContent = '';
      mensaje.classList.remove('error');
    });
    campo.addEventListener('change', function () {
      campo.removeAttribute('aria-invalid');
      mensaje.textContent = '';
      mensaje.classList.remove('error');
    });
  });

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // Demostración: no existe servidor receptor.

    const valorNombre = nombre.value.trim();
    const valorCorreo = correo.value.trim();
    const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]*$/;
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    formulario.querySelectorAll('[aria-invalid="true"]').forEach(function (campo) {
      campo.removeAttribute('aria-invalid');
    });

    // 1. El nombre es obligatorio y debe tener letras.
    if (valorNombre === '') {
      mostrarError('Debes escribir tu nombre.', nombre);
      return;
    }
    if (valorNombre.length < 3 || !patronNombre.test(valorNombre)) {
      mostrarError('Escribe un nombre válido (mínimo 3 caracteres, sin números).', nombre);
      return;
    }

    // 2. El email es obligatorio y debe tener formato válido.
    if (valorCorreo === '') {
      mostrarError('Debes escribir tu correo electrónico.', correo);
      return;
    }
    if (!patronCorreo.test(valorCorreo)) {
      mostrarError('Escribe un correo válido, por ejemplo: alumno@correo.com.', correo);
      return;
    }

    // 3. Es obligatorio elegir una opción de sexo.
    if (!formulario.querySelector('input[name="sexo"]:checked')) {
      mostrarError('Debes seleccionar una opción de sexo.', radiosSexo[0]);
      return;
    }

    // 4. Validar que la fecha esté completa.
    if (dia.value === '') {
      mostrarError('Selecciona el día de nacimiento.', dia);
      return;
    }
    if (mes.value === '') {
      mostrarError('Selecciona el mes de nacimiento.', mes);
      return;
    }
    if (anio.value === '') {
      mostrarError('Selecciona el año de nacimiento.', anio);
      return;
    }

    // 5. Verificar fecha real, incluyendo febrero y años bisiestos.
    const numeroDia = Number(dia.value);
    const numeroMes = Number(mes.value);
    const numeroAnio = Number(anio.value);
    const fecha = new Date(numeroAnio, numeroMes - 1, numeroDia);
    const fechaValida = fecha.getFullYear() === numeroAnio &&
      fecha.getMonth() === numeroMes - 1 &&
      fecha.getDate() === numeroDia;

    if (!fechaValida) {
      mostrarError('La fecha de nacimiento no existe. Revísala.', dia);
      return;
    }

    // 6. No permitir fechas de nacimiento futuras.
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha > hoy) {
      mostrarError('La fecha de nacimiento no puede ser futura.', anio);
      return;
    }

    // Todos los campos son correctos. Solo informar, sin enviar datos.
    nombre.value = valorNombre;
    correo.value = valorCorreo;
    mensaje.classList.remove('error');
    mensaje.textContent = 'Formulario validado correctamente. Los datos no se enviaron (demostración).';
  });
});
