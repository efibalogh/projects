import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { EventOutgoing, EventIncoming } from '../../types/event';
import { useEvents, useDeleteEvent, useSearchEvents } from '../../hooks/eventHooks';
import GenericList from '../common/GenericList';
import EventSearchForm from './EventSearchForm';

export default function EventList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchFilter, setSearchFilter] = useState<EventIncoming | null>(() => {
    const name = searchParams.get('name') || '';
    const location = searchParams.get('location') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    if (name || location || startDate || endDate) {
      return { name, location, startDate, endDate };
    }
    return null;
  });

  const { data: events = [], isLoading } = useEvents();
  const { data: searchResults = [], isLoading: isSearching } = useSearchEvents(searchFilter);
  const deleteEvent = useDeleteEvent();

  const displayedEvents = searchFilter ? searchResults : events;

  const handleClear = () => {
    setSearchFilter(null);
    setSearchParams({});
  };

  const handleSearch = (filter: EventIncoming) => {
    const hasFilters = Object.values(filter).some((value) => value !== '');
    if (hasFilters) {
      setSearchFilter(filter);
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      setSearchParams(params);
    } else {
      handleClear();
    }
  };

  const getEventSecondaryText = (event: EventOutgoing) => event.location;

  return (
    <>
      <EventSearchForm onSearch={handleSearch} onClear={handleClear} initialValues={searchFilter} />
      <GenericList
        title={t('events.title')}
        items={displayedEvents}
        isLoading={isLoading || isSearching}
        onDelete={deleteEvent.mutateAsync}
        getItemId={(event) => event.id}
        getItemPrimaryText={(event) => event.name}
        getItemSecondaryText={getEventSecondaryText}
        getViewLink={(id) => `/events/${id}`}
        getEditLink={(id) => `/events/${id}/edit`}
        emptyListMessage={t('events.emptyListMessage')}
        createNewLink="/events/new"
        createNewText={t('events.create')}
      />
    </>
  );
}
