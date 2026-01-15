import React, { useState, useEffect, useRef } from 'react';
import { FaCreditCard, FaExchangeAlt } from 'react-icons/fa';
import ReactGA from 'react-ga4';
import ReCAPTCHA from 'react-google-recaptcha';

// SVG Icons for project types
const icons = {
  // Sitio Web - Navegador/Monitor
  sitioWeb: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  // Desarrollo de Software - Código
  software: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
      <line x1="14" y1="4" x2="10" y2="20"/>
    </svg>
  ),
  // Tienda Online - Carrito de compras
  ecommerce: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  // Landing Page - Página con cohete
  landingPage: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M12 11l-2 2 2 2 2-2-2-2z"/>
      <line x1="12" y1="15" x2="12" y2="18"/>
    </svg>
  ),
  // Aplicación Web - Grid/Dashboard
  webApp: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  // Aplicación Móvil - Smartphone
  mobileApp: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12" y2="18"/>
      <circle cx="12" cy="18" r="1"/>
    </svg>
  ),
  // Plataforma Moodle - Sombrero de graduación/educación
  moodle: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 10l-10-5L2 10l10 5 10-5z"/>
      <path d="M6 12v5c0 2 3 4 6 4s6-2 6-4v-5"/>
      <line x1="22" y1="10" x2="22" y2="16"/>
    </svg>
  )
};

// Steps for the sidebar
const wizardSteps = [
  { number: 1, title: 'Tipo de proyecto', subtitle: '¿Qué tipo de proyecto deseas?' },
  { number: 2, title: 'Información del negocio', subtitle: 'Cuéntanos sobre tu negocio' },
  { number: 3, title: 'Características web', subtitle: '¿Qué funcionalidades deseas?' },
  { number: 4, title: 'Automatizaciones', subtitle: 'Especifica tus integraciones' },
  { number: 5, title: 'Presupuesto y pago', subtitle: '¿Cuál es tu presupuesto?' },
  { number: 6, title: 'Información adicional', subtitle: '¿Algo más que debamos saber?' },
  { number: 7, title: 'Datos de contacto', subtitle: '¿Cómo te contactamos?' }
];

const AffiliationSection = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Sitio Web');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const recaptchaRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedSubPlan, setSelectedSubPlan] = useState('Web estándar');
  const [currentStep, setCurrentStep] = useState(1);

  // Project types mapping con iconos
  const projectTypes = [
    { id: 'Sitio Web', name: 'Sitio Web', icon: icons.sitioWeb },
    { id: 'Desarrollo de Software', name: 'Desarrollo de Software', icon: icons.software },
    { id: 'Tienda Online', name: 'Tienda Online', icon: icons.ecommerce },
    { id: 'Landing Page', name: 'Landing Page', icon: icons.landingPage },
    { id: 'Aplicación Web', name: 'Aplicación Web', icon: icons.webApp },
    { id: 'Aplicación Movil', name: 'Aplicación Móvil', icon: icons.mobileApp },
    { id: 'Plataforma de cursos Moodle', name: 'Plataforma Moodle', icon: icons.moodle }
  ];

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setSelectedSubPlan('Web estándar');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert('Por favor completa el reCAPTCHA');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://www.undercodeec.com/guardar_datos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          'g-recaptcha-response': recaptchaToken
        }),
      });

      if (response.ok) {
        setFormSubmitted(false);
        await new Promise(resolve => setTimeout(resolve, 50));
        setFormSubmitted(true);

        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
        setRecaptchaToken('');
        if (recaptchaRef.current) recaptchaRef.current.reset();

        setShowError(false);
        setShowForm(false);
        setShowSuccessAlert(true);

        await handlePayment(true);
      } else {
        alert('Error al enviar la información.');
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      alert('Ocurrió un error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });

  useEffect(() => {
    if (
      formData.nombre ||
      formData.email ||
      formData.telefono ||
      formData.mensaje
    ) {
      setShowError(false);
    }
  }, [formData]);

  // Plan details - mantener lógica para uso futuro
  const planDetails = {
    'Landing Page': {
      subPlans: {
        'Web estándar': {
          price: '$40',
          features1: [
            'Tu dominio.com & hosting por un año',
            'Diseño estandar',
            'Página autoadministrable',
            'SEO basico (busquedas en Google palabra unica)',
          ],
          features2: [
            'Formularios de contacto',
            'Botones de WhatsApp',
            'Correos corporativos',
            'Una sola pestaña interna',
          ],
        },
        'Web completa': {
          price: '$80',
          features1: [
            'Tu dominio.com & hosting por un año',
            'Google Analytics integrado & Pixel Meta',
            'Página autoadministrable',
            'SEO con Google Ads (publicidad)',
            'Integraciones personalizadas',
          ],
          features2: [
            'Creacion de resdes sociales',
            'Diseño personalizado',
            'Botones de WhatsApp',
            'Seguridad integrada (firewall)',
            'copias de seguridad automaticas',
          ],
        }
      }
    },
    'Página Informativa': {
      subPlans: {
        'Web estándar': {
          price: '$60',
          features1: [
            'Tu dominio.com & hosting por un año',
            'Inicio, servicios, nosotros, contacto',
            'SEO basico (busquedas en Google palabra unica)',
            'Diseño estandar',
          ],
          features2: [
            'Google Analytics integrado',
            'Formulario de contacto',
            'Botones de whatsApp',
            'Correos corporativos',
          ],
        },
        'Web completa': {
          price: '$160',
          features1: [
            'Tu dominio.com por un año',
            'Creacion de resdes sociales',
            'Inicio, tienda , nosotros, contacto',
            'Hasta 4 pestañas internas adicionales',
            'SEO con Google Ads (publicidad)',
          ],
          features2: [
            'Página autoadministrable',
            'Formulario de contacto',
            'Botones de WhatsApp',
            'Correos corporativos',
            'Copias de seguridad automaticas',
            'Seguridad integrada (firewall)',
          ],
        }
      }
    },
    'Tienda Online': {
      subPlans: {
        'Tienda Online estándar': {
          price: '$125',
          features1: [
            'Tu dominio.com & hosting por un año',
            'Catálogo de tus productos',
            'Pasarela de pago con tarjetas debito/credito',
            'Google Analytics integrado',
            'SEO basico (busquedas en Google palabra unica)',
          ],
          features2: [
            'Formulario de contacto',
            'Botones de whatsApp para comprar',
            'Correos corporativos',
            'Confirmación de pago al correo electrónico',
          ],
        },
        'Tienda Online completa': {
          price: '$290',
          features1: [
            'Tu dominio.com & hosting por un año',
            'Sube tus productos de forma ilimitada',
            'Pasarela de pago con tarjetas debito/credito',
            'Copias de seguridad automaticas',
            'SEO con Google Ads (publicidad)',
            'Creacion de resdes sociales',
            'Correos corporativos',
          ],
          features2: [
            'Inicio, tienda , nosotros, contacto (varias paginas integradas)',
            'Carrito de compra',
            'Confirmación de pago al correo electrónico',
            'Videos tutoriales integrados a WordPress',
            'Seguridad integrada (firewall)',
            'Botones de whatsApp para comprar',
          ],
        }
      }
    },
    'Plataforma de cursos': {
      subPlans: {
        'Plataforma estandar': {
          price: '$250',
          features1: [
            'Tu dominio.com & hosting por un año',
            'Tu propia plataforma de cursos tipo Crehana, Domestika, Netflix',
            'Portal completo para estudiantes y profesores',
            'SEO basico (busquedas en Google palabra unica)',
          ],
          features2: [
            'Certificados automáticos',
            'Vende tus cursos en línea',
            'Sube cursos de forma ilimitada',
            'Correos corporativos',
            'SEO con Google Ads (publicidad)',
            'Seguridad integrada (firewall)',
          ],
        },
        'Plataforma completa': {
          price: '$350',
          features1: [
            'Tu dominio.com & hosting por un año',
            'Tu propia plataforma de cursos tipo Crehana, Domestika, Netflix',
            'Portal completo para estudiantes y profesores',
            'Videos tutoriales integrados',
            'Creacion de resdes sociales',
          ],
          features2: [
            'Certificados automáticos',
            'Vende tus cursos en línea',
            'Sube cursos de forma ilimitada',
            'Correos corporativos',
            'SEO con Google Ads (publicidad)',
            'Seguridad integrada (firewall)',
          ],
        }
      }
    },
    'Otro': {
      subPlans: {
        'Proyecto personalizado': {
          price: 'Cotizar',
          features1: [
            'Consultoría personalizada',
            'Análisis de requerimientos',
            'Propuesta a medida',
            'Presupuesto detallado',
          ],
          features2: [
            'Desarrollo a la medida',
            'Soporte técnico incluido',
            'Integraciones especiales',
            'Escalabilidad garantizada',
          ],
        }
      }
    }
  };

  // Mantener lógica de pago para uso futuro (sin botones visibles)
  const handlePayment = async (isFormSubmitted = formSubmitted) => {
    console.log('Iniciando handlePayment - formSubmitted:', isFormSubmitted);

    if (!isFormSubmitted) {
      console.warn('Payment bloqueado: formulario no enviado');
      setShowForm(true);
      setShowBankDetails(false);
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const plan = planDetails[selectedPlan];
      const currentSubPlan = plan.subPlans[selectedSubPlan];
      const priceStr = currentSubPlan ? currentSubPlan.price : '$0';
      const amount = parseFloat(priceStr.replace('$', '').replace(',', ''));

      console.log('Enviando solicitud de pago para:', selectedPlan, amount);

      const response = await fetch('https://api.undercodeec.com/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          planName: selectedPlan,
          customerEmail: formData.email
        }),
      });

      const data = await response.json();
      console.log('Respuesta de pago:', data);

      if (!response.ok) throw new Error(data.error || 'Error en la API de pago');

      if (data.paymentUrl) {
        setTimeout(() => {
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.location.href = data.paymentUrl;
          } else {
            alert('Por favor permite ventanas emergentes para completar el pago');
            window.location.href = data.paymentUrl;
          }
        }, 2000);
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (error) {
      console.error('Error en handlePayment:', error);
      alert(`Error al generar pago: ${error.message}`);
      setShowSuccessAlert(false);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId) => {
    const matchingPlan = Object.keys(planDetails).find(key => key === projectId);
    if (matchingPlan) {
      handlePlanChange(matchingPlan);
      const firstSubPlan = Object.keys(planDetails[matchingPlan].subPlans)[0];
      setSelectedSubPlan(firstSubPlan);
    }

    ReactGA.event({
      category: 'Planes',
      action: 'click_tipo_proyecto',
      label: projectId,
    });

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'SeleccionarTipoProyecto', {
        tipo: projectId,
      });
    }
  };

  return (
    <section id="planes" className="wizard-section">
      <div className="container">
        <div className="section-head text-center mb-60">
          <h6 className="sub-head">
            <span className="fz-12">PLAN DE PRECIOS</span>
          </h6>
          <h2>Elija el plan adecuado para usted.</h2>
        </div>
        <div className="plans-two-columns">
          {/* COLUMNA IZQUIERDA - Agendar Reunión */}
          <div className="schedule-column">
            <div className="schedule-card">
              <h2>Únase a Undercodeec</h2>
              <p>Programa una visita guiada rápida de 15 minutos y uno de nuestros asesores te atenderá.</p>
              <img src="/landing-preview/img/img-call.png" alt="Visita Guiada" className="schedule-img" />
              <button
                className="btn-schedule"
                onClick={() => {
                  ReactGA.event({
                    category: 'Interacción',
                    action: 'click_reserva_llamada',
                    label: 'Botón Reserva una llamada introductoria',
                  });
                  if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('trackCustom', 'ClickReservaLlamada', {
                      source: 'AffiliationSection',
                    });
                  }
                }}
              >
                <a href="#reserva_agenda" className="button-reservation">
                  Reserva una llamada introductoria de 15 minutos
                </a>
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA - Wizard de Tarjetas */}
          <div className="wizard-column">
            <div className="wizard-content">
              <h2>¿Qué tipo de proyecto planificas?</h2>
              <p className="wizard-subtitle">
                Ayúdanos a entender las necesidades de tu proyecto seleccionando el tipo principal de sitio web que deseas construir.
              </p>

              {/* Project Type Cards */}
              <div className="project-cards-grid">
                {projectTypes.map((project, index) => (
                  <div
                    key={index}
                    className={`project-card ${selectedPlan === project.id ? 'active' : ''}`}
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    <div className="project-card-icon">
                      {project.icon}
                    </div>
                    <h4>{project.name}</h4>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="wizard-nav">
                <button className="btn-back" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                </button>
                <button className="btn-next-step" onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}>
                  Siguiente paso
                </button>
              </div>
            </div>

            {/* Sidebar with Steps */}
            <div className="wizard-sidebar-inline">
              <ul className="step-list">
                {wizardSteps.map((step) => (
                  <li
                    key={step.number}
                    className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                  >
                    <div className="step-number">{step.number}</div>
                    <div className="step-content">
                      <h5>{step.title}</h5>
                      <p>{step.subtitle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliationSection;
