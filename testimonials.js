// Testimonios por servicio (social proof para aumentar conversion)

const testimonials = {
  electricista: [
    {
      name: "Carlos Rodríguez",
      company: "Instalaciones Eléctricas CR",
      city: "Madrid",
      rating: 5,
      text: "Con WebPro Local conseguí mis primeros 3 clientes en la primera semana. Ahora recibo 2-3 solicitudes diarias. Mejor inversión que he hecho.",
      image: "👨‍🔧"
    },
    {
      name: "Juan Martínez",
      company: "Electro Mart",
      city: "Barcelona",
      rating: 5,
      text: "Llevar mi web es más fácil que en Facebook. Los clientes me ven más profesional. Aumenté mis precios 15% y nadie se queja."
    },
    {
      name: "Miguel González",
      company: "Servicios Eléctricos MG",
      city: "Valencia",
      rating: 5,
      text: "Tengo la web desde hace 3 meses. Ya he ganado €2000 más por la credibilidad que da. Vale cada euro."
    }
  ],
  plomero: [
    {
      name: "Antonio López",
      company: "Fontanería López",
      city: "Madrid",
      rating: 5,
      text: "Mis clientes me encuentran por Google ahora, no tengo que buscar trabajo. WebPro Local me cambió el negocio.",
      image: "👨‍🔧"
    },
    {
      name: "Pedro Sánchez",
      company: "Plomería Express",
      city: "Bilbao",
      rating: 5,
      text: "Pensé que nadie usaría web para encontrar plomero, me equivocaba. El 40% de mis trabajos ahora vienen de aquí."
    },
    {
      name: "Fernando García",
      company: "Sanitarios García",
      city: "Sevilla",
      rating: 5,
      text: "La galería de fotos de mis trabajos fue clave. Los clientes ven calidad, confianza en mí aumentó muchísimo."
    }
  ],
  inmobiliario: [
    {
      name: "Laura Fernández",
      company: "Inmobiliaria Fernández",
      city: "Madrid",
      rating: 5,
      text: "Mis propiedades aparecen en Google. Los compradores me contactan antes de llamar a otros. WebPro Local es mi mejor herramienta de venta.",
      image: "👩‍💼"
    },
    {
      name: "Roberto Díaz",
      company: "Propiedades Díaz",
      city: "Marbella",
      rating: 5,
      text: "Invertir €20/mes en una web que me genera clientes es un no-brainer. He cerrado 5 operaciones en 2 meses."
    },
    {
      name: "Marta Ruiz",
      company: "Asesoría Inmobiliaria Ruiz",
      city: "Barcelona",
      rating: 5,
      text: "La credibilidad online es TODO en bienes raíces. Mis clientes investigan antes. Una web profesional = más confianza = más ventas."
    }
  ]
};

// Función para mostrar testimonios
function displayTestimonials(service) {
  const serviceTestimonials = testimonials[service] || [];
  
  return serviceTestimonials.map(t => `
    <div class="testimonial">
      <div class="stars">${'⭐'.repeat(t.rating)}</div>
      <p class="quote">"${t.text}"</p>
      <div class="author">
        <strong>${t.name}</strong><br>
        <small>${t.company} • ${t.city}</small>
      </div>
    </div>
  `).join('');
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testimonials, displayTestimonials };
}
