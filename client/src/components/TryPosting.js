import Card from './Card';

function TryPosting({name, canLoggedInUserSubmitPostOnUserProfilePage}) {
  return (
    <Card rootContainerStyle={{width: canLoggedInUserSubmitPostOnUserProfilePage ? undefined : '580px'}}>
      <h2 className='heading-try-posting'>
        Try {canLoggedInUserSubmitPostOnUserProfilePage || 'adding friend and'} posting to get started
      </h2>
      <p className='body-try-posting'>
        Be the first to post on {name ? `${name}'s` : 'your'} wall.
      </p>
    </Card>
  );
}

export default TryPosting;