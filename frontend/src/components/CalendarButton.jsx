import React, { useState, useMemo, useEffect } from "react";
import { api } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Clock, 
  MapPin,
  Download,
  Share2,
  Bell,
  Check
} from "lucide-react";

// ==================== CONFIGURATION DU CALENDRIER ====================
const CALENDAR_CONFIG = {
  // Jours de la semaine
  weekDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  
  // Mois de l'année
  months: [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ],
  
  // Événements du calendrier (chargés depuis l'API)
  events: [] /*
    {
      id: 1,
      title: "Séance des Jeunes",
      date: "2024-03-18",
      time: "18:00 - 19:00",
      location: "Salle Polyvalente",
      type: "jeunes",
      color: "from-blue-500 to-cyan-500",
      description: "Étude biblique et partage pour les jeunes"
    },
    {
      id: 2,
      title: "Étude Biblique",
      date: "2024-03-19",
      time: "18:00 - 19:00",
      location: "Salle d'étude",
      type: "etude",
      color: "from-green-500 to-emerald-500",
      description: "Approfondissement de la parole de Dieu"
    },
    {
      id: 3,
      title: "Culte de Prière",
      date: "2024-03-20",
      time: "18:00 - 19:00",
      location: "Sanctuaire",
      type: "priere",
      color: "from-purple-500 to-pink-500",
      description: "Soirée de prière et d'intercession"
    },
    {
      id: 4,
      title: "Enseignement",
      date: "2024-03-21",
      time: "18:00 - 19:00",
      location: "Salle Polyvalente",
      type: "etude",
      color: "from-orange-500 to-amber-500",
      description: "Enseignement approfondi"
    },
    {
      id: 5,
      title: "Louange et Adoration",
      date: "2024-03-22",
      time: "18:00 - 19:00",
      location: "Sanctuaire",
      type: "louange",
      color: "from-red-500 to-rose-500",
      description: "Soirée de louange intense"
    },
    {
      id: 6,
      title: "Réveil Spirituel",
      date: "2024-03-23",
      time: "18:00 - 19:00",
      location: "Sanctuaire",
      type: "special",
      color: "from-indigo-500 to-blue-500",
      description: "Moment de réveil spirituel"
    },
    {
      id: 7,
      title: "Culte d'Action de Grâce",
      date: "2024-04-07",
      time: "09:00 - 12:00",
      location: "Sanctuaire",
      type: "special",
      color: "from-yellow-500 to-amber-500",
      description: "Célébration spéciale"
    },
    {
      id: 8,
      title: "Conférence Annuelle",
      date: "2024-07-15",
      time: "09:00 - 18:00",
      location: "Sanctuaire",
      type: "conference",
      color: "from-purple-500 to-pink-500",
      description: "Conférence avec des orateurs invités"
    }
  ]*/
};

// ==================== COMPOSANT MINI CALENDRIER ====================
const MiniCalendar = ({ currentDate, onDateChange, events, onEventClick }) => {
  const [viewDate, setViewDate] = useState(currentDate || new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate);
  const days = [];

  // Jours vides avant le premier jour du mois
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Jours du mois
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
    const dayEvents = events.filter(e => e.date === dateStr);
    days.push({ day: i, events: dayEvents });
  }

  const changeMonth = (delta) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
  };

  const goToToday = () => {
    setViewDate(new Date());
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-lg p-4">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {CALENDAR_CONFIG.months[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors text-sm"
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {CALENDAR_CONFIG.weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-base-content/60">
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square p-1 rounded-lg transition-all
              ${day ? 'hover:bg-base-200 cursor-pointer' : ''}
              ${day?.events.length > 0 ? 'bg-accent/5' : ''}
            `}
            onClick={() => day && onDateChange && onDateChange(day.day)}
          >
            {day && (
              <div className="h-full flex flex-col">
                <span className={`
                  text-sm font-medium
                  ${day.events.length > 0 ? 'text-accent' : ''}
                `}>
                  {day.day}
                </span>
                {day.events.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {day.events.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${event.color}`}
                        title={event.title}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== COMPOSANT ÉVÉNEMENT DU JOUR ====================
const DayEvent = ({ event, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`
        p-3 rounded-lg cursor-pointer border-l-4
        bg-gradient-to-r ${event.color} bg-opacity-5
        hover:shadow-md transition-all
      `}
      style={{
        borderLeftColor: event.color.split(' ')[1].replace('from-', '')
      }}
      onClick={() => onClick(event)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
          <div className="flex items-center gap-2 text-xs text-base-content/70">
            <Clock className="w-3 h-3" />
            <span>{event.time}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-base-content/70 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${event.color}`} />
      </div>
    </motion.div>
  );
};

// ==================== COMPOSANT MODAL CALENDRIER ====================
const CalendarModal = ({ isOpen, onClose, events, onEventClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' ou 'list'

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventsForSelectedDate = () => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const downloadCalendar = () => {
    // Créer un fichier ICS pour l'import dans les calendriers
    const eventsICS = events.map(event => {
      const [year, month, day] = event.date.split('-');
      const [startHour, startMin] = event.time.split(' - ')[0].split(':');
      const [endHour, endMin] = event.time.split(' - ')[1].split(':');
      
      const startDate = new Date(year, month - 1, day, startHour, startMin);
      const endDate = new Date(year, month - 1, day, endHour, endMin);
      
      return `BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT`;
    }).join('\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Église ETDV//Calendrier//FR
${eventsICS}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'calendrier-eglise.ics';
    link.click();
  };

  const shareCalendar = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Calendrier de l\'Église',
        text: 'Découvrez tous les programmes de notre église',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const selectedDayEvents = getEventsForSelectedDate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center p-4">
              <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-5xl relative">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-accent to-accent/80 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-8 h-8 text-white" />
                      <div>
                        <h2 className="text-2xl font-bold text-white">Calendrier des Programmes</h2>
                        <p className="text-white/80">Retrouvez tous nos événements</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Corps du modal */}
                <div className="p-6">
                  {/* Vue toggle */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode('month')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          viewMode === 'month'
                            ? 'bg-accent text-white'
                            : 'bg-base-200 hover:bg-base-300'
                        }`}
                      >
                        Vue Mois
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          viewMode === 'list'
                            ? 'bg-accent text-white'
                            : 'bg-base-200 hover:bg-base-300'
                        }`}
                      >
                        Vue Liste
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={downloadCalendar}
                        className="p-2 hover:bg-base-200 rounded-lg transition-colors"
                        title="Télécharger le calendrier"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={shareCalendar}
                        className="p-2 hover:bg-base-200 rounded-lg transition-colors"
                        title="Partager"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {viewMode === 'month' ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Mini calendrier */}
                      <div className="md:col-span-2">
                        <MiniCalendar
                          currentDate={selectedDate}
                          onDateChange={(day) => {
                            setSelectedDate(new Date(
                              selectedDate.getFullYear(),
                              selectedDate.getMonth(),
                              day
                            ));
                          }}
                          events={activeEvents}
                          onEventClick={onEventClick}
                        />
                      </div>

                      {/* Événements du jour sélectionné */}
                      <div className="md:col-span-1">
                        <div className="bg-base-200 rounded-xl p-4">
                          <h3 className="font-semibold mb-3">
                            {formatDateForDisplay(selectedDate)}
                          </h3>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {selectedDayEvents.length > 0 ? (
                              selectedDayEvents.map(event => (
                                <DayEvent
                                  key={event.id}
                                  event={event}
                                  onClick={onEventClick}
                                />
                              ))
                            ) : (
                              <p className="text-center text-base-content/50 py-8">
                                Aucun événement ce jour
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Vue Liste */
                    <div className="space-y-4">
                      {events
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                            onClick={() => onEventClick(event)}
                          >
                            <div className={`w-1 h-12 rounded-full bg-gradient-to-r ${event.color}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-accent">
                                  {new Date(event.date).toLocaleDateString('fr-FR', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </span>
                                <span className="text-xs text-base-content/50">•</span>
                                <span className="text-xs text-base-content/50">{event.time}</span>
                              </div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-base-content/70">{event.location}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-base-content/50" />
                          </motion.div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Pied du modal */}
                <div className="border-t border-base-300 p-4 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    Fermer
                  </button>
                  <button className="btn btn-accent">
                    <Bell className="w-4 h-4 mr-2" />
                    Recevoir les rappels
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== COMPOSANT BOUTON CALENDRIER ====================
const CalendarButton = ({ events, onEventClick }) => {
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Charger les événements depuis l'API si aucun n'est fourni
  useEffect(() => {
    if (!events) {
      const fetchEvents = async () => {
        try {
          const { data } = await api.get('/api/programs');
          setFetchedEvents(data);
        } catch (err) {
          console.error('Erreur chargement événements:', err);
        }
      };
      fetchEvents();
    }
  }, [events]);

  const activeEvents = events || fetchedEvents;

  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      // Comportement par défaut
      setNotification({
        show: true,
        message: `Événement sélectionné : ${event.title}`
      });
      setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    }
  };

  return (
    <>
      {/* Bouton principal */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCalendarOpen(true)}
        className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-accent transition-all duration-300"
      >
        <CalendarIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Voir le calendrier</span>
      </motion.button>

      {/* Modal Calendrier */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        events={events}
        onEventClick={handleEventClick}
      />

      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-accent text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <Check className="w-5 h-5" />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CalendarButton;