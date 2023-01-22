window.onload = () => {
  InitBoard(ArrToProcess)
}

const solveDfsBtn = document.querySelector('#solve-dfs')
const solveABtn = document.querySelector('#solve-a')
const solveHillBtn = document.querySelector('#solve-hill')
const stepTxt = document.querySelector('#step-text')
const BoxContainer = document.querySelector('.box-con')

const ex1 = [
  [5, 1, 2, 4],
  [9, 7, 3, 8],
  [0, 6, 11, 12],
  [13, 10, 14, 15],
]
var ArrToProcess = ex1

const _toggleBtn = (state) => {
  if (state) {
    solveDfsBtn.classList.add('disabled')
    solveABtn.classList.add('disabled')
    solveHillBtn.classList.add('disabled')
  } else {
    solveDfsBtn.classList.remove('disabled')
    solveABtn.classList.remove('disabled')
    solveHillBtn.classList.remove('disabled')
  }
}

const _animateBoard = (board) => {
  let counter = 0
  const interval = setInterval(() => {
    counter += 1
    InitBoard(board[counter])
    stepTxt.innerHTML = `Step: ${counter}`
    if (counter == board.length - 1) {
      clearInterval(interval)
      _toggleBtn()
    }
  }, 1000)
}

const _solveDfs = async (arr) => {
  loadingOverlay.activate()
  _toggleBtn(true)
  setTimeout(async () => {
    try {
      const resp = await dfs(arr)
      let board = resp.board_list.reverse()
      loadingOverlay.cancelAll()
      _animateBoard(board)
    } catch (error) {
      _toggleBtn()
      loadingOverlay.cancelAll()
    }
  }, 1000)
}

const _solveA = (arr) => {
  loadingOverlay.activate()
  _toggleBtn(true)
  setTimeout(async () => {
    try {
      const resp = await aStar(arr)
      let board = resp.board_list.reverse()
      loadingOverlay.cancelAll()
      _animateBoard(board)
    } catch (error) {
      _toggleBtn()
      loadingOverlay.cancelAll()
    }
  }, 1000)
}

const _solveHill = (arr) => {
  loadingOverlay.activate()
  _toggleBtn(true)
  setTimeout(async () => {
    try {
      const resp = await hillClimbing(arr)
      let board = resp.board_list
      loadingOverlay.cancelAll()
      _animateBoard(board)
    } catch (error) {
      _toggleBtn()
      loadingOverlay.cancelAll()
    }
  }, 1000)
}

const SolveBoard = (type) => {
  InitBoard(ArrToProcess)
  stepTxt.innerHTML = 'Step: 0'
  switch (type) {
    case 'dfs':
      _solveDfs(ArrToProcess)
      break
    case 'a*':
      _solveA(ArrToProcess)
      break
    case 'hill':
      _solveHill(ArrToProcess)
      break
    default:
      _solveDfs(ArrToProcess)
      break
  }
}

const InitBoard = (boardArr) => {
  let _boardArr = boardArr.flat(1)

  const _boardElems = _boardArr.map((item) => {
    const _parent = document.createElement('div')
    _parent.classList.add('col-3')

    if (item == 0) {
      const _child = document.createElement('div')
      _child.classList.add('item-box-empty')
      _parent.appendChild(_child)
      return _parent
    } else {
      const _child = document.createElement('div')
      _child.classList.add('item-box')
      _child.innerHTML = item
      _parent.appendChild(_child)
      return _parent
    }
  })

  BoxContainer.children[0].replaceChildren(..._boardElems)
}
