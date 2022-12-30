const dx = [1, 0, -1, 0]
const dy = [0, 1, 0, -1]

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

let dfs_previous = {}
function dfs_rec(u, depth) {
  if (depth == 21) {
    return false
  }
  if (compute_heuristic(u.state) == 0) {
    return true
  }
  let found = false
  let r = getRandomInt(4)
  for (let d = 0; d < 4; ++d) {
    let new_i = dx[(d + r) % 4] + u.z_i
    let new_j = dy[(d + r) % 4] + u.z_j

    if (0 <= new_i && new_i < 4 && 0 <= new_j && new_j < 4) {
      // console.log(u)
      const newstate = JSON.parse(JSON.stringify(u.state))
      newstate[new_i][new_j] = u.state[u.z_i][u.z_j]
      newstate[u.z_i][u.z_j] = u.state[new_i][new_j]

      if (dfs_previous[newstate] == undefined) {
        dfs_previous[newstate] = u.state
        if (dfs_rec({ state: newstate, z_i: new_i, z_j: new_j }, depth + 1))
          return true
      }
    }
  }
  return false
}

function DFS(initial_state) {
  return new Promise((resolve, reject) => {
    // dfs_previo
    dfs_previous = {}
    dfs_previous[initial_state] = -1
    let init_z_i = -1,
      init_z_j = -1

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (initial_state[i][j] == 0) {
          init_z_i = i
          init_z_j = j
          break
        }
      }
    }

    if (dfs_rec({ state: initial_state, z_i: init_z_i, z_j: init_z_j }, 0)) {
      let board_list = []

      let x = JSON.parse(JSON.stringify(initial_state))
      while (x != -1) {
        board_list.push(x)
        x = dfs_previous[x]
      }
      board_list.push([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0],
      ])

      resolve({ found: true, board_list: board_list })
    }

    reject({ found: false, board_list: [] })
  })
}

function compute_heuristic(state) {
  let h = 0
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      if (state[i][j] == 0) {
        h += 3 - i + (3 - j)
        continue
      }
      let x = Math.floor((state[i][j] - 1) / 4)
      let y = (state[i][j] - 1) % 4
      h += Math.abs(x - i) + Math.abs(y - j)
    }
  }

  return h
}

function a_star(initial_state) {
  return new Promise((resolve, reject) => {
    const distance = {}
    distance[initial_state] = 0

    const previous = {}
    previous[initial_state] = -1

    const pqueue = new Heap((o1, o2) => {
      return o1.priority > o2.priority
    })

    let init_z_i = -1,
      init_z_j = -1

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (initial_state[i][j] == 0) {
          init_z_i = i
          init_z_j = j
          break
        }
      }
    }

    pqueue.insert({
      state: initial_state,
      z_i: init_z_i,
      z_j: init_z_j,
      priority: compute_heuristic(initial_state),
    })

    let found = false

    while (!pqueue.isEmpty()) {
      u = pqueue.pop()

      if (compute_heuristic(u.state) == 0) {
        found = true
        break
      }

      let z_i = u.z_i,
        z_j = u.z_j

      for (let d = 0; d < 4; ++d) {
        let new_i = dx[d] + z_i,
          new_j = dy[d] + z_j
        if (0 <= new_i && new_i < 4 && 0 <= new_j && new_j < 4) {
          const newstate = JSON.parse(JSON.stringify(u.state))
          newstate[new_i][new_j] = u.state[z_i][z_j]
          newstate[z_i][z_j] = u.state[new_i][new_j]

          if (
            (distance[newstate] != undefined
              ? distance[newstate]
              : 9999999999) >
            distance[u.state] + 1
          ) {
            distance[newstate] = distance[u.state] + 1
            pqueue.insert({
              state: newstate,
              z_i: new_i,
              z_j: new_j,
              priority: compute_heuristic(newstate) + distance[newstate],
            })
            previous[newstate] = u.state
          }
        }
      }
    }

    if (found) {
      let board_list = []

      let x = JSON.parse(JSON.stringify(initial_state))
      while (x != -1) {
        board_list.push(x)
        x = previous[x]
      }
      board_list.push([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0],
      ])

      resolve({ found: true, board_list: board_list })
    }

    reject({ found: false, board_list: [] })
  })
}
