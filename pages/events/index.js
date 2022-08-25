import { Fragment } from 'react';
import { useRouter } from 'next/router';

import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';

function AllEventsPage(props) {
  const router = useRouter();
  const {events} = props;

  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;
    
    router.push(fullPath);
  }

  return (
    <Fragment>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </Fragment>
  );
}

export async function getStaticProps() {
  const response = await fetch(
    "https://udemy-max-react-course-code-3-default-rtdb.asia-southeast1.firebasedatabase.app/events.json"
  )
  const data = await response.json()
  const transformedEvents = [];  
  
  for (const key in data) {
    transformedEvents.push({
      id: key, 
      title: data[key].title, 
      description: data[key].description,
      location: data[key].location,
      date: data[key].date,
      image: data[key].image,
      isFeatured: data[key].isFeatured
    })
  }  

  if (!transformedEvents) {
    return {
      redirect: {
        destination: "/no-data"
      }
    }
  }

  if (transformedEvents.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      events: transformedEvents
    },
    revalidate: 10
  }
}

export default AllEventsPage;