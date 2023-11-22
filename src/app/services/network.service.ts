import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { EventsService } from './basic/events.service';
import { UtilityService } from './utility.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(
    public utility: UtilityService,
    public api: ApiService,
    public router: Router,
    private events: EventsService
  ) {
    // console.log('Hello NetworkProvider Provider');
  }

  serialize = (obj) => {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  };

  login(data) {
    return this.httpPostResponse('auth/login', data, null, false);
  }

  logout() {
    return this.httpPostResponse('auth/logout', null, null, true);
  }

  deleteAccount(data) {
    return this.httpPostResponse('auth/delete-account', data, null, true);
  }

  register(data) {
    return this.httpPostResponse('auth/register', data, null, true);
  }

  forgotPassword(data) {
    return this.httpPostResponse('auth/forgot-password', data);
  }

  submitOTP(data) {
    return this.httpPostResponse('auth/verify-reset-password-otp', data);
  }

  getUser() {
    return this.httpGetResponse('user', null, false, false);
  }

  getStates() {
    return this.httpGetResponse('states');
  }

  getInterests() {
    return this.httpGetResponse('profile/interests');
  }

  getCities(id) {
    if (!id || isNaN(id)) {
      return;
    }
    return this.httpGetResponse(`cities/${id}`);
  }

  postData(data, id = null) {
    return this.httpPostResponse('posts', data, id, true);
  }

  editUser(data) {
    return this.httpPostResponse('user/edit', data, null, true);
  }

  getPosts(orderBy = 'created_at', sortedBy = 'desc') {
    return this.httpGetResponse(
      `posts?orderBy=${orderBy}&sortedBy=${sortedBy}`,
      null,
      false
    );
  }

  getBloackedUsers(data, page) {
    return this.httpGetResponse(`users/my-block-list?page=${page}&query=${data.query}`, null, false);
  }

  likePost(postId) {
    return this.httpPostResponse(`posts/${postId}/like`, null, null, false);
  }

  addComment(data) {
    return this.httpPostResponse('comments', data, null, false);
  }

  deletePost(post_id) {
    return this.httpDeleteResponse(`posts/${post_id}`);
  }

  getChatMessages(id = '4edff87e-4b27-479b-ab5a-6f6841f6ec83') {
    return this.httpGetResponse(`chats/messages/${id}?page=1`, null, false);
  }

  sendChatMessages(data, id = '4f26f995-b292-4fae-8aba-2d2ebbb84edb') {
    return this.httpPostResponse(`chats/messages/${id}`, data);
  }

  getFriends() {
    return this.httpGetResponse(
      `users/friends?orderBy=created_at&sortedBy=desc`,
      null,
      false
    );
  }

  getUsers() {
    return this.httpGetResponse(
      `users?orderBy=created_at&sortedBy=desc`,
      null,
      false
    );
  }

  unfriend(id) {
    return this.httpDeleteResponse(`users/unfriend-request/${id}`);
  }
  cancelRequest(id) {
    return this.httpDeleteResponse(`users/cancel-friend-request/${id}`);
  }

  acceptRequest(id) {
    return this.httpPatchResponse(
      `users/accept-friend-request/${id}`,
      null,
      null
    );
  }

  ignoreRequest(id) {
    return this.httpDeleteResponse(`users/ignore-friend-request/${id}`);
  }

  block(id) {
    return this.httpPatchResponse(
      `users/block-friend-request/${id}`,
      null,
      null
    );
  }

  unblock(id) {
    return this.httpPatchResponse(
      `users/unblock-friend-request/${id}`,
      null,
      null
    );
  }

  addFriend(id) {
    return this.httpPostResponse(`users/add-friend/${id}`, null, null, false);
  }

  unblockFriend(id) {
    return this.httpPatchResponse(
      `users/unblock-friend-request/${id}`,
      null,
      null
    );
  }

  updateProfilePicture(data) {
    let body = new URLSearchParams();
    body.set('profile_image', data);
    // alert(body)
    return this.httpPostResponse('user/profile-image-upload', body.toString(), null, true, true, 'application/x-www-form-urlencoded');
  }

  // https://testv23.demowebsitelinks.com/hunter_social.com/public/api/my-products
  broadcastAuth(token) {
    return this.httpPostResponse(`broadcasting/auth?token=${token}`, null);
  }

  switchToDatingProfile(data) {
    return this.httpPostResponse(`users/dating`, data, null, false);
  }

  getDatings(dating_users, search, page) {
    var str = `users?orderBy=created_at&sortedBy=desc`;

    if (dating_users && dating_users != '') {
      str += `&dating_users=${dating_users}`;
    }
    if (search && search != '') {
      str += `&search=name:${search};email:${search}`;
    }
    str += page ? `&page=${page}` : `&page=1`;

    return this.httpGetResponse(str, null, false);
  }

  searchDatingUsers(data) {
    var str = `users/dating?orderBy=created_at&sortedBy=desc`;
    var p = this.serialize(data);
    str = str + '&' + p;
    // if (search && search != '') {
    //   str += `&search=name:${search};email:${search}`;
    // }

    return this.httpGetResponse(str, null, false);
  }

  saveFcmToken(data) {
    return new Promise<any>((res) => { });
    // Todo
  }

  getEquipments() {
    return this.httpGetResponse(
      `equipments?orderBy=created_at&sortedBy=desc`,
      null,
      true
    );
  }

  getEquipmentReviews(id, page) {
    return this.httpGetResponse(
      `equipments/reviews/${id}?page=` + page,
      null,
      false
    );
  }

  getEquipmentShow(id) {
    return this.httpGetResponse(`equipments/${id}`, null, false);
  }

  editreview(data, id) {
    return this.httpPostResponse(`reviews/${id}`, data, null, true);
  }

  addReview(data, id) {
    return this.httpPostResponse(`equipments/reviews/${id}`, data, null, true);
  }

  deleteReview(id) {
    return this.httpDeleteResponse(`equipments/reviews/${id}`);
  }

  getrecipes(page) {
    return this.httpGetResponse(
      `recipes${page ? `?page=${page}` : ''}`,
      null, false
    );
  }
  getMyProducts() {
    return this.httpPostResponse(`products`, null, false, false);
  }

  getMyListing(data, page) {
    return this.httpPostResponse(`my-products?page=${page}`, data, false, false);
  }

  getProductss(data, page) {
    return this.httpPostResponse(`products?page=${page}`, data, false);
  }

  getSearch(data) {
    return this.httpPostResponse(`products`, data, false);
  }

  createListing(data) {
    return this.httpPostResponse(
      `marketplace/product/create`,
      data,
      null,
      true
    );
  }
  getCategories(data: string) {
    return this.httpPostResponse(`categories?query=` + data, null, false);
  }
  getCategoriess(data: string) {
    return this.httpPostResponse(`categories`, data, null, false);
  }
  markAsSold(productid) {
    return this.httpGetResponse(`products/mark-as-sold/${productid}`, null, true);
  }

  openToSell(productid) {
    return this.httpGetResponse(`products/open-to-sell/${productid}`, null, true);
  }


  getProducts() {
    return this.httpGetResponse(`products`, null, false);
  }

  getProductDetail(id) {
    return this.httpGetResponse('products', id);
  }

  addProductReview(data) {
    return this.httpPostResponse('reviews', data);
  }

  editProductReview(review_id, data) {
    return this.httpPostResponse(`reviews/${review_id}`, data, null, true);
  }

  deleteProductReview(id) {
    return this.httpDeleteResponse(`reviews/${id}`);
  }


  addEquipmentReview(id, data) {
    return this.httpPostResponse(
      'equipments/reviews/' + id,
      data,
      false,
      true,
      false
    );
  }

  addToCart(data) {
    return this.httpPostResponse('add-to-cart', data);
  }

  getCart() {
    return this.httpGetResponse('cart', null, false, false);
  }

  getProductReviews(id) {
    return this.httpGetResponse('reviews', id);
  }

  updatePassword(data) {
    return this.httpPostResponse(`user/password`, data, null, false);
  }

  getGroupTypes() {
    return this.httpGetResponse(`get-groups`, null, false);
  }

  requestGroup(data) {
    return this.httpPostResponse(`request-group`, data, null, true);
  }

  getGroups() {
    return this.httpGetResponse(`groups`, null, false);
  }

  joinChatRoom(data) {
    return this.httpPostResponse(`users/groups/join`, data, null, false);
  }

  getChatRoomMessages(id) {
    return this.httpGetResponse(
      `chats/messages/group/${id}?page=1`,
      null,
      false
    );
  }

  leaveGroup(channel_id) {
    return this.httpPostResponse(`users/groups/leave`, { channel_id }, null);
  }

  getRanches(state = undefined, page) {
    // return this.httpGetResponse(`map-data/ranches`, null, true);
    return this.httpGetResponse(
      state
        ? `map-data/ranches/${state}?page=${page}`
        : `map-data/ranches?page=${page}`,
      null,
      false
    );
  }

  getProfessionalHunting(state = undefined, page) {
    return this.httpGetResponse(
      state
        ? `map-data/professional_hunting/${state}`
        : `map-data/professional_hunting?page=${page}`,
      null,
      false
    );
  }

  getTaxidermy(state = undefined, page) {
    return this.httpGetResponse(
      state
        ? `map-data/taxidermy/${state}?page=${page}`
        : `map-data/taxidermy?page=${page}`,
      null,
      false
    );
  }

  getProcessing(state = undefined, page) {
    return this.httpGetResponse(
      state
        ? `map-data/processing/${state}?page=${page}`
        : `map-data/processing?page=${page}`,
      null,
      false
    );
  }

  sendChatGroupMessage() { }

  addRecipe(data) {
    return this.httpPostResponse(`recipes`, data, null, true);
  }

  editRecipe(data, id) {
    return this.httpPutResponse(`recipes/` + id, data, null);
  }

  increaseDecrese(data, isIncreased = true) {
    return this.httpPostResponse(
      isIncreased ? 'cart/increase' : 'cart/decrease',
      data
    );
  }

  increaseDecreseRemove(data) {
    return this.httpPostResponse('cart/remove', data);
  }

  checkOut(data) {
    return this.httpPostResponse(`checkout`, data, null, true);
  }

  howToVideos(pageno) {
    return this.httpGetResponse(`how-to-videos?page=${pageno}`, null, false);
  }

  postHowToVideo(data, id) {
    return this.httpPostResponse(
      `how-to-videos${id ? `/${id}` : ''}`,
      data,
      null,
      true
    );
  }

  contactUs(data) {
    return this.httpPostResponse('contact-us', data, null, true);
  }

  getInterest(search) {
    return this.httpGetResponse(`profile/interests/${search}`);
  }

  deleteHowToVideo(id) {
    return this.httpDeleteResponse(`how-to-videos/${id}`);
  }

  commentHowToVideo(id, comment) {
    return this.httpPostResponse(
      'how-to-videos/' + id + '/comments',
      { comment },
      null
    );
  }

  getHowToVideoComments(id) {
    return this.httpGetResponse('how-to-videos/' + id + '/comments');
  }

  rateRecipe(id, rating) {
    return this.httpPostResponse(
      'recipes/' + id + '/reviews',
      { rating },
      null,
      true
    );
  }
  postReason(data) {
    return this.httpPostResponse('reported', data, null, false, false);
  }

  blockUser(data) {
    return this.httpPostResponse('users/block', data, null, true);
  }

  unblockUser(userid, data) {
    return this.httpPostResponse(`users/unblock/${userid}`, data, null, true);
  }

  deleteRecipe(id) {
    console.log(id);

    return this.httpDeleteResponse(`recipes/${id}`);
  }

  deleteHowToComment(id) {
    return this.httpDeleteResponse('comments/' + id);
  }

  getUserProfile(id) {
    return this.httpGetResponse('profile/user', id);
  }

  getUserPosts(id) {
    return this.httpGetResponse('profile/posts', id);
  }

  getPostCount(id) {
    return this.httpGetResponse('profile/post-count', id);
  }

  getConnectionCount(id) {
    return this.httpGetResponse('profile/connection-count', id);
  }

  updatePackage(id, data) {
    return this.httpPostResponse(`update-package/${id}`, data);
  }

  subscribeNewsletter(data) {
    return this.httpPostResponse(`subscribe`, data);
  }

  getSettings() {
    return this.httpGetResponse(`settings`, null, false, false);
  }

  getUserSettings() {
    return this.httpGetResponse(`user/settings`, null, false, false);
  }

  updateMemership(user_id, payment_status, package_id) {
    return this.httpPostResponse(
      `membership/${user_id}/${payment_status}/${package_id}`,
      null
    );
  }

  feedback(data) {
    return this.httpPostResponse(`feedback`, data, null, true);
  }

  resetPassword(data) {
    return this.httpPostResponse(`auth/reset-password`, data, null, true);
  }

  updateMemershipPayment(email, package_id, userid) {
    // let obj = {
    //   email :email,
    //   packageid : package_id,
    //   userid
    // }
    // alert(JSON.stringify(obj));
    return this.httpGetResponse(
      `charge-payment/${email}/${package_id}/${userid}`,
      null
    );
  }

  getStripePublishableKey() {
    return this.httpGetResponse(`get-stripe-key`, null);
  }


  getDashboardFriends(page, limit) {
    return this.httpGetResponse(`users/dashboard-friends?search=&page=${page}&limit=${limit}`, null);
  }
  getNotifications(page, limit) {
    return this.httpGetResponse(`users/notifications?page=${page}&limit=${limit}`, null);
  }
  getUnreadNotificationCount() {
    return this.httpGetResponse(`users/notifications/unread-count`, null);
  }
  readNotifiaction(data) {
    return this.httpPostResponse(`users/notifications/unread-notifications`, data, null);
  }



  getRecipeAlerts(page, limit) {
    return this.httpGetResponse(`users/fetch-recipe-alerts?page=${page}&limit=${limit}`, '');
  }
  getPostAlerts(page, limit) {
    return this.httpGetResponse(`users/fetch-post-alerts?page=${page}&limit=${limit}`, '');
  }

  getUserOrders() {
    return this.httpGetResponse(`orders`);
  }

  setFcmToken(token) {
    return this.httpPostResponse(`user/fcm-token`, { token: token }, null)
  }
  deleteFcmToken(token) {
    return this.httpDeleteResponse(`user/fcm-token/${token}`)
  }


  httpPostResponse(
    key,
    data,
    id = null,
    showloader = false,
    showError = true,
    contenttype = 'application/json'
  ) {
    // alert(contenttype);
    return this.httpResponse(
      'post',
      key,
      data,
      id,
      showloader,
      showError,
      contenttype
    );
  }

  httpGetResponse(
    key,
    id = null,
    showloader = false,
    showError = true,
    contenttype = 'application/json'
  ) {
    return this.httpResponse(
      'get',
      key,
      {},
      id,
      showloader,
      showError,
      contenttype
    );
  }

  httpPutResponse(key, data, id = null) {
    return new Promise((resolve, reject) => {
      id = id ? `/${id}` : '';
      const url = key + id;

      this.api.put(key, data).subscribe((res: any) => {
        // if (showloader === true) {
        this.utility.hideLoader();
        // }
        resolve(res);
        // if (res.bool !== true) {
        //   if (showError) {
        //     this.utility.presentSuccessToast(res.message);
        //   }
        //   reject(null);
        // } else {
        //   resolve(res);
        // }
      });
    });
  }

  httpPatchResponse(key, data, id = null) {
    return new Promise<any>((resolve, reject) => {
      id = id ? `/${id}` : '';
      const url = key + id;

      this.api.patch(key, data).subscribe((res: any) => {
        // if (showloader === true) {
        this.utility.hideLoader();
        //}
        resolve(res);
        // if (res.bool !== true) {
        //   if (showError) {
        //     this.utility.presentSuccessToast(res.message);
        //   }
        //   reject(null);
        // } else {
        //   resolve(res);
        // }
      });
    });
  }

  httpDeleteResponse(key) {
    return new Promise<any>((resolve, reject) => {
      this.api.delete(key).subscribe((res: any) => {
        console.log(res);
        //if (showloader === true) {
        this.utility.hideLoader();
        //}
        resolve(res);

        // if (res.bool !== true) {
        //   if (showError) {
        //     this.utility.presentSuccessToast(res.message);
        //   }
        //   reject(null);
        // } else {
        //   resolve(res);
        // }
      });
    });
  }

  // default 'Content-Type': 'application/json',
  httpResponse(
    type = 'get',
    key,
    data,
    id = null,
    showloader = false,
    showError = true,
    contenttype = 'application/json'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (showloader === true) this.utility.showLoader();

      id = id ? '/' + id : '';
      const url = key + id;

      let headerobj = {}
      if (contenttype == 'application/x-www-form-urlencoded') {
        const headers = new HttpHeaders({ "Content-Type": contenttype });
        headerobj = { headers: headers }
      }

      const seq = type === 'get' ? this.api.get(url, {}) : Object.keys(headerobj).length > 0 ? this.api.post(url, data, headerobj) : this.api.post(url, data);

      seq.subscribe(
        (res: any) => {
          if (showloader === true) {
            this.utility.hideLoader();
          }
          resolve(res);

          // if (res.success !== true) {
          //   if (showError) {
          //     this.utility.presentSuccessToast(res.message);
          //   }
          //   reject(null);
          // } else {
          //   resolve(res);
          // }
        },
        (err) => {
          const error = err.error;
          console.log('err', err);

          this.utility.hideLoader();
          if (showError) {
            let errorKeys = error?.errors ? Object.keys(error.errors) : [];
            if (errorKeys && errorKeys.length) {
              console.log('Error is', error.errors[errorKeys[0]]);

              this.utility.presentFailureToast(error.errors[errorKeys[0]][0]);
            } else {
              this.utility.presentFailureToast(
                error.message
                // + ' ' + error.errors.email
                //   ? error.errors.email[0]
                //   : ''
              );
            }
          }

          // if(err.status === 401){
          //   this.router.navigate(['splash']);
          // }

          resolve(err);
        }
      );
    });
  }

  showFailure(err) {
    // console.error('ERROR', err);
    err = err ? err.message : 'check logs';
    this.utility.presentFailureToast(err);
  }
}
