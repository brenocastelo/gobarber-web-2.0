import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logo from '../../assets/logo.svg';
import {
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointments,
  Section,
  Appointment,
} from './styles';
import api from '../../services/api';

interface DayAvailability {
  day: number;
  available: boolean;
}

interface Appointments {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDaysOfMoth, setAvailableDaysOfMoth] = useState<
    DayAvailability[]
  >([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);

  const { signOut, user } = useAuth();

  useEffect(() => {
    api
      .get(`providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => setAvailableDaysOfMoth(response.data));
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointments[]>('/appointments/schedule', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const formattedAppointments = response.data.map(appointment => ({
          ...appointment,
          formattedHour: format(parseISO(appointment.date), 'HH:mm'),
        }));

        setAppointments(formattedAppointments);
      });
  }, [selectedDate]);

  const unavailableDaysOfMonth = useMemo(() => {
    const unavailableDays = availableDaysOfMoth.filter(
      day => day.available === false,
    );

    const parsedUnavailableDay = unavailableDays.map(unavailableDay => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        unavailableDay.day,
      );

      return date;
    });

    return parsedUnavailableDay;
  }, [availableDaysOfMoth, currentMonth]);

  const selectedDay = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedDayOfWeek = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() < 12,
    );
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() >= 12,
    );
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  const handleDayChange = useCallback((day: Date, modifier: DayModifiers) => {
    if (modifier.available && !modifier.disabled) {
      setSelectedDate(day);
    }
  }, []);

  return (
    <>
      <Header>
        <HeaderContent>
          <img src={logo} alt="Go Barber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem vindo,</span>
              <Link to="/profile">{user.name}</Link>
            </div>
          </Profile>

          <button type="button" title="Sign Out" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          {/**
           * tag unavailable days on calendar according with returned days from api
           *
           * get available days in month from api
           *  - call api passing:
           *    - user id [route param]
           *    - year, month, day [query] params
           *    it will return an array of objects with day and availability properties
           *
           *   - react day picker expects an array dates, so wee need to parse
           *    api response to array of unavailable dates and so on pass to react day picker
           */}
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDay}</span>
            <span>{selectedDayOfWeek}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointments>
              <p>Atendimento a seguir</p>

              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>

                <span>
                  <FiClock />
                  {nextAppointment?.formattedHour}
                </span>
              </div>
            </NextAppointments>
          )}

          <Section>
            <strong>Manhã</strong>
            {!morningAppointments.length && (
              <p>Não existem agendamentos para esta manhã</p>
            )}
            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {!afternoonAppointments.length && (
              <p>Não existem agendamentos para esta tarde</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            // last month allowed
            fromMonth={new Date()}
            // week day labels
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // month labels
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...unavailableDaysOfMonth]}
            /**
             * available is a css class on react-day-picker styles
             * on days passed on daysOfWeek property, this styles will be applied
             */
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            selectedDays={selectedDate}
            onDayClick={handleDayChange}
            onMonthChange={setCurrentMonth}
          />
        </Calendar>
      </Content>
    </>
  );
};

export default Dashboard;
