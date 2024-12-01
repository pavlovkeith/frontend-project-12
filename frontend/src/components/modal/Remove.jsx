const handleDelete = () => dispatch(removeChannel({ id: channel.id, authHeader }))
  .then((data) => {
    if (!data.error) {
      toast.success(t('toasts.channelDeleted'));
      const generalChannel = channels.find((ch) => ch.name === 'General');
      dispatch(channelsActions.setCurrentChannel(generalChannel.id));
      closeModal();
    } else {
      toast.error(t('toasts.connectionError'));
      rollbar.error(data.error);
    }
  });
