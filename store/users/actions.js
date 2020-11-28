import throttle from 'lodash.throttle';

export const actions = {
  loadPosts: throttle(async function ({ state, commit }, payload) {
    //내가 작성한 글만 불러옴, 진행중인것도 종료된것도 전부 불러옴
    try {
      if (payload && payload.reset) {
        const res = await this.$axios.get(`/posts/${state.me.id}`);
        commit('loadPosts', {
          data: res.data,
          reset: true,
        });
        return;
      }
      if (state.hasMorePost) {
        const lastPost = state.allPosts[state.allPosts.length - 1];
        //lastPost가 존재하는지 체크하고 lastPost.id를 넘김
        const res = await this.$axios.get(
          `/posts/${state.me.id}?lastId=${lastPost && lastPost.id}&limit=5`,
        );
        commit('loadPosts', {
          data: res.data,
        });
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }, 2000),
  loadClosedPosts: throttle(async function ({ commit }, payload) {
    //내가 작성한 글만 불러옴, 진행중인것도 종료된것도 전부 불러옴
    try {
      if (payload && payload.reset) {
        const res = await this.$axios.get(`/posts/${payload.userId}/closed`);
        commit('loadClosedPosts', {
          data: res.data,
          reset: true,
        });
        return;
      }
      if (state.hasMorePost) {
        const lastPost = state.closedPosts[state.closedPosts.length - 1];
        //lastPost가 존재하는지 체크하고 lastPost.id를 넘김
        const res = await this.$axios.get(
          `/posts/${payload.userId}/closed?lastId=${
            lastPost && lastPost.id
          }&limit=5`,
        );
        commit('loadClosedPosts', {
          data: res.data,
        });
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }, 2000),
  loadRecruitingPosts: throttle(async function ({ commit }, payload) {
    //내가 작성한 글만 불러옴, 진행중인것도 종료된것도 전부 불러옴
    try {
      if (payload && payload.reset) {
        const res = await this.$axios.get(
          `/posts/${payload.userId}/recruiting`,
        );
        commit('loadRecruitingPosts', {
          data: res.data,
          reset: true,
        });
        return;
      }
      if (state.hasMorePost) {
        const lastPost =
          state.recruitingPosts[state.recruitingPosts.length - 1];
        const res = await this.$axios.get(
          `/posts/${payload.userId}/recruiting?lastId=${
            lastPost && lastPost.id
          }&limit=5`,
        );
        commit('loadRecruitingPosts', {
          data: res.data,
        });
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }, 2000),
  // loadUser: throttle(async function ({commit, state}, payload) {
  //   try {
  //     const res = await this.$axios.get('/user', {
  //       withCredentials: true,
  //     });
  //     commit('setMe', res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, 1000),
  async loadUser({ state, commit }) {
    try {
      const res = await this.$axios.get('/user', {
        withCredentials: true,
      });
      commit('setMe', res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async withdrawal({ commit }, payload) {
    return await this.$axios
      .delete(`/user/${payload.userId}`)
      .then(res => {
        commit('setMe', null);
        return res;
      })
      .catch(err => {
        return err;
      });
  },

  logIn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/user/login',
          {
            email: payload.email,
            password: payload.password,
          },
          {
            withCredentials: true,
          },
        )
        .then(res => {
          if (res.status === 200) {
            commit('setMe', res.data);
            resolve(res.status);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  signUp({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/user',
          {
            email: payload.email,
            password: payload.password,
            name: payload.name,
            about: payload.about,
          },
          {
            withCredentials: true,
          },
        )
        .then(res => {
          console.log(res.status);
          if (res.status === 200) {
            commit('setMe', res.data);
            resolve(res.status);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  logOut({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/user/logout',
          {},
          {
            withCredentials: true,
          },
        )
        .then(res => {
          if (res.status === 200) {
            commit('setMe', null);
            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  async loadConnectionUser({ state, commit }, payload) {
    try {
      const res = await this.$axios.get(`/user/${payload.id}`, {
        withCredentials: true,
      });
      commit('setMe', res.data);
    } catch (err) {
      console.error(err);
    }
  },
  updateProfile({ commit, state }, payload) {
    return this.$axios
      .post(
        `/user/update/${payload.userId}`,
        {
          userId: payload.userId,
          job: payload.job,
          location: payload.location,
          about: payload.about,
        },
        {
          withCredentials: true,
        },
      )
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.error(err);
      });
  },
  updateProfileImage({ commit, state }, formData) {
    return this.$axios
      .post(`/user/image`, formData, {
        withCredentials: true,
      })
      .then(res => {
        commit('updateProfileImage', res.data);
        return res.data;
      });
  },
  updateMedia({ commit, state }, payload) {
    return this.$axios
      .post(
        `/media/user/${payload.userId}`,
        {
          github: payload.github,
          gmail: payload.gmail,
          facebook: payload.facebook,
        },
        {
          withCredentials: true,
        },
      )
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.error(err);
      });
  },
  async githubLogIn({ commit }, payload) {
    await this.$axios
      .post(
        '/auth/githubLogin',
        {
          email: payload.email,
          socialType: payload.socialType,
        },
        {
          withCredentials: true,
        },
      )
      .then(res => {
        commit('setMe', res.data);
      })
      .catch(err => {
        console.error(err);
      });
  },
};

export default actions;
