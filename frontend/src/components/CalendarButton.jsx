import React, { useState, useMemo, useEffect } from "react";
import { api } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, MapPin,
  Download, Share2, Bell, Check, List, Grid3X3, ChevronRight as ArrowRight
} from "lucide-react";

const WEEKDAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DAY_MAP = { dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6 };

const COLOR_DOT = {
  accent: "bg-accent", primary: "bg-primary", secondary: "bg-secondary",
  info: "bg-info", success: "bg-success", warning: "bg-warning", error: "bg-error",
};

const getNextDayDate = (dayName) => {
  const target = DAY_MAP[dayName?.toLowerCase()];
  if (target === undefined) return null;
  const today = new Date();
  const current = today.getDay();
  let diff = target - current;
  if (diff <= 0) diff += 7;
  const d = new Date(today);
  d.setDate(d.getDate() + diff);
  return d;
};

const toDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const progToEvents = (programs) => {
  const events = [];
  programs.forEach((p) => {
    if (p.day) {
      const d = getNextDayDate(p.day);
      if (d) events.push({ ...p, date: toDateStr(d), _computed: true });
    } else if (p.week || p.month) {
      events.push({ ...p, date: p.dates || null });
    } else {
      events.push({ ...p, date: null });
    }
  });
  return events;
};

const MiniCalendar = ({ currentDate, onDateSelect, events }) => {
  const [viewDate, setViewDate] = useState(currentDate || new Date());

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const ds = toDateStr(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
    days.push({ day: i, date: ds, evts: events.filter(e => e.date === ds) });
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date())} className="btn btn-ghost btn-xs">Auj.</button>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="btn btn-ghost btn-xs p-1"><ChevronLeft size={16} /></button>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="btn btn-ghost btn-xs p-1"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-medium text-base-content/50">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const isToday = d && d.date === toDateStr(new Date());
          return (
            <div key={i}
              onClick={() => d && onDateSelect?.(d.date)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer text-sm transition-all
                ${isToday ? 'bg-accent text-white font-bold' : 'hover:bg-base-200'}
                ${!d ? '' : ''}`}
            >
              {d && <>
                <span>{d.day}</span>
                {d.evts.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {d.evts.slice(0, 4).map((ev, j) => (
                      <span key={j} className={`w-1 h-1 rounded-full ${COLOR_DOT[ev.color] || 'bg-accent'}`} />
                    ))}
                  </div>
                )}
              </>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarModal = ({ isOpen, onClose, events, onEventClick }) => {
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(toDateStr(new Date()));

  const dayEvents = useMemo(() => events.filter(e => e.date === selectedDate), [events, selectedDate]);

  const sorted = useMemo(() => [...events].filter(e => e.date).sort((a, b) => a.date.localeCompare(b.date)), [events]);

  const undated = useMemo(() => events.filter(e => !e.date), [events]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-2 md:inset-10 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-2">
              <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-5xl">
                <div className="bg-gradient-to-r from-accent to-accent/80 p-5 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-7 h-7 text-white" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Calendrier</h2>
                      <p className="text-white/80 text-sm">Tous les programmes et événements</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-white" /></button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex gap-2">
                      <button onClick={() => setViewMode('month')}
                        className={`btn btn-sm ${viewMode === 'month' ? 'btn-accent' : 'btn-ghost'}`}>
                        <Grid3X3 size={15} /> Mois
                      </button>
                      <button onClick={() => setViewMode('list')}
                        className={`btn btn-sm ${viewMode === 'list' ? 'btn-accent' : 'btn-ghost'}`}>
                        <List size={15} /> Liste
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { const b = new Blob([''], {type:'text/calendar'}); const l=document.createElement('a');l.href=URL.createObjectURL(b);l.download='calendrier.ics';l.click(); }}
                        className="btn btn-ghost btn-sm" title="Télécharger"><Download size={15} /></button>
                      <button onClick={() => { navigator.clipboard?.writeText?.(window.location.href); }}
                        className="btn btn-ghost btn-sm" title="Partager"><Share2 size={15} /></button>
                    </div>
                  </div>

                  {viewMode === 'month' ? (
                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="md:col-span-2">
                        <MiniCalendar currentDate={new Date()} onDateSelect={setSelectedDate} events={events} />
                      </div>
                      <div>
                        <div className="bg-base-200 rounded-xl p-4">
                          <h3 className="font-semibold text-sm mb-3">
                            {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sélectionnez un jour'}
                          </h3>
                          <div className="space-y-2 max-h-80 overflow-y-auto">
                            {dayEvents.length > 0 ? dayEvents.map(ev => (
                              <div key={ev.id} onClick={() => onEventClick?.(ev)}
                                className="p-3 rounded-lg bg-base-100 cursor-pointer hover:shadow-sm transition-all border-l-4"
                                style={{ borderLeftColor: `var(--${ev.color || 'accent'})` }}>
                                <p className="font-semibold text-sm">{ev.title}</p>
                                {ev.time && <p className="text-xs text-base-content/60 flex items-center gap-1 mt-1"><Clock size={12} />{ev.time}</p>}
                                {ev.location && <p className="text-xs text-base-content/50 flex items-center gap-1 mt-0.5"><MapPin size={12} />{ev.location}</p>}
                              </div>
                            )) : (
                              <p className="text-center text-base-content/40 py-8 text-sm">Aucun événement ce jour</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Événements datés */}
                      {sorted.length > 0 && <h3 className="font-semibold">Événements programmés</h3>}
                      {sorted.map((ev, i) => (
                        <motion.div key={ev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                          onClick={() => onEventClick?.(ev)}
                          className="flex items-center gap-4 p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors">
                          <div className="text-center min-w-[48px]">
                            <p className="text-lg font-bold text-accent">{new Date(ev.date + 'T12:00:00').getDate()}</p>
                            <p className="text-xs text-base-content/50">{MONTHS[new Date(ev.date + 'T12:00:00').getMonth()].slice(0, 3)}</p>
                          </div>
                          <div className={`w-1 h-10 rounded-full ${COLOR_DOT[ev.color] || 'bg-accent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{ev.title}</p>
                            <p className="text-xs text-base-content/60">{ev.time}{ev.location ? ` · ${ev.location}` : ''}</p>
                          </div>
                          <ArrowRight size={16} className="text-base-content/30 flex-shrink-0" />
                        </motion.div>
                      ))}
                      {/* Programmes sans date (hebdo avec jour) */}
                      {undated.length > 0 && (
                        <>
                          <h3 className="font-semibold pt-4">Programmes hebdomadaires</h3>
                          {undated.map((ev, i) => (
                            <motion.div key={ev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                              onClick={() => onEventClick?.(ev)}
                              className="flex items-center gap-4 p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors">
                              <div className={`w-1 h-10 rounded-full ${COLOR_DOT[ev.color] || 'bg-accent'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{ev.title}</p>
                                <p className="text-xs text-base-content/60">{ev.day || ''}{ev.time ? ` · ${ev.time}` : ''}{ev.location ? ` · ${ev.location}` : ''}</p>
                              </div>
                              <ArrowRight size={16} className="text-base-content/30 flex-shrink-0" />
                            </motion.div>
                          ))}
                        </>
                      )}
                      {sorted.length === 0 && undated.length === 0 && (
                        <p className="text-center py-10 text-base-content/40">Aucun événement</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CalendarButton = ({ events, onEventClick }) => {
  const [fetched, setFetched] = useState([]);
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState({ show: false, msg: '' });

  useEffect(() => {
    if (!events) {
      api.get('/api/programs').then(({ data }) => setFetched(data)).catch(() => {});
    }
  }, [events]);

  const allProgs = events || fetched;
  const calendarEvents = useMemo(() => progToEvents(allProgs), [allProgs]);

  const showNotif = (msg) => { setNotif({ show: true, msg }); setTimeout(() => setNotif({ show: false, msg: '' }), 3000); };

  return (
    <>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-accent transition-all">
        <CalendarIcon className="w-5 h-5" />
        <span>Voir le calendrier</span>
      </motion.button>

      <CalendarModal isOpen={open} onClose={() => setOpen(false)} events={calendarEvents}
        onEventClick={(ev) => { onEventClick?.(ev); showNotif(`Événement : ${ev.title}`); }} />

      <AnimatePresence>
        {notif.show && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-accent text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
            <Check className="w-5 h-5" /><span>{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CalendarButton;
