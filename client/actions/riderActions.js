import Marty, { ActionCreators } from 'marty';
import ActionConstants from '../constants/actionConstants';

class RiderActions extends ActionCreators {
  createRider(rider) {
    this.dispatch(ActionConstants.CREATE_RIDER, rider);

    this.app.riderAPI.createRider(rider).then(newRider => {
      this.dispatch(ActionConstants.CREATE_RIDER_DONE, rider.id, newRider);
    }).catch(err => {
      this.dispatch(ActionConstants.CREATE_RIDER_FAILED, rider, err);
    });
  }

  updateRider(rider) {
    this.dispatch(ActionConstants.UPDATE_RIDER, rider);

    this.app.riderAPI.updateRider(rider).then(updatedRider => {
      this.dispatch(ActionConstants.UPDATE_RIDER_DONE, updatedRider);
    }).catch(err => {
      this.dispatch(ActionConstants.UPDATE_RIDER_FAILED, rider, err);
    });
  }
}

export default RiderActions;