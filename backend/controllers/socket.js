const store = require('./store')
const env = require('../env')

const timers = {
  userPSA: null,
  roomPSA: null
}

const typeMap = {
  psa: {
    userList: 'USERLIST_REFRESH',
    roomList: 'ROOMLIST_REFRESH',
    psa: 'PSA'
  },
  ssa: {
    kick: 'ADMIN_KICK',
    ban: 'ADMIN_BAN',
    pm: 'PRIVATE_MESSAGE',
    invite: 'INVITATION',
    room: 'ROOM_CHAT',
    ssa: 'SSA'
  }
}

const socketConnection = {
  io: null
}

/**
 * PSA
 */

const sendUserListPSA = () => {
  const getUserList = () => {
    return store.getUserList().map(user => {
      return {
        id: user.id,
        username: user.username,
        isOnline: !!user.socketId
      }
    })
  }

  store.utils.refreshUserListAsync().then(() => {
    socketConnection.io.emit(typeMap.psa.psa, {
      type: typeMap.psa.userList,
      payload: getUserList()
    })
  })
}

const sendRoomListPSA = () => {
  store.utils.refreshRoomListAsync().then(() => {
    socketConnection.io.emit(typeMap.psa.psa, {
      type: typeMap.psa.roomList,
      payload: store.getRoomList()
    })
  })
}

/**
 * SSA
 */

const sendKickSSA = ({ socketId, roomId, userId }) => {
  socketConnection.io.to(socketId).emit(typeMap.ssa.ssa, {
    type: typeMap.ssa.kick,
    payload: { roomId, userId }
  })
}

const sendbanSSA = ({ socketId, roomId, userId }) => {
  socketConnection.io.to(socketId).emit(typeMap.ssa.ssa, {
    type: typeMap.ssa.ban,
    payload: { roomId, userId }
  })
}

const sendPMSSA = ({ socketId, fromUserId, content }) => {
  socketConnection.io.to(socketId).emit(typeMap.ssa.ssa, {
    type: typeMap.ssa.pm,
    payload: { fromUserId, content }
  })
}

const sendInviteSSA = ({ socketId, roomId, roomName, password, fromUserId }) => {
  socketConnection.io.to(socketId).emit(typeMap.ssa.ssa, {
    type: typeMap.ssa.invite,
    payload: { roomId, roomName, password, fromUserId }
  })
}

const sendRoomChatSSA = ({ socketId, roomId, userId, content }) => {
  socketConnection.io.to(socketId).emit(typeMap.ssa.ssa, {
    type: typeMap.ssa.room,
    payload: { roomId, userId, content }
  })
}

/**
 * REGISTER
 */

const registerIOConnection = io => {
  socketConnection.io = io
}

const registerGlobalController = () => {
  timers.userPSA = setInterval(() => sendUserListPSA(), env.psaInterval)
  timers.roomPSA = setInterval(() => sendRoomListPSA(), env.psaInterval)
}

module.exports = {
  registers: {
    registerIOConnection,
    registerGlobalController
  },
  emitters: {
    sendKickSSA,
    sendbanSSA,
    sendPMSSA,
    sendInviteSSA,
    sendRoomChatSSA
  }
}
