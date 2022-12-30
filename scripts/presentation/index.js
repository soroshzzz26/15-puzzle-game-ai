window.onload = () => {
  InitBoard(ArrToProcess)
}

const solveDfsBtn = document.querySelector('#solve-dfs')
const solveABtn = document.querySelector('#solve-a')
const stepTxt = document.querySelector('#step-text')
const BoxContainer = document.querySelector('.box-con')

const ex1 = [
  [1, 14, 13, 2],
  [6, 10, 8, 4],
  [9, 7, 12, 15],
  [5, 11, 3, 0],
]
const ex2 = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 0, 15],
]

var ArrToProcess = ex1

const onRadioChange = (val) => {
  switch (val) {
    case 0:
      InitBoard(ex1)
      break
    case 1:
      InitBoard(ex2)
      break

    default:
      InitBoard(ex1)
      break
  }
}

const _toggleBtn = (state) => {
  if (state) {
    solveDfsBtn.classList.add('disabled')
    solveABtn.classList.add('disabled')
  } else {
    solveDfsBtn.classList.remove('disabled')
    solveABtn.classList.remove('disabled')
  }
}

const _solveDfs = (arr) => {
  _toggleBtn()
  console.log(arr)
  console.log(DFS(arr))
}

const _solveA = (arr) => {
  _toggleBtn()
  console.log(arr)
  console.log(a_star(arr))
}

const SolveBoard = (type) => {
  switch (type) {
    case 'dfs':
      _solveDfs(ArrToProcess)
      break
    case 'a*':
      _solveA(ArrToProcess)
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
  ArrToProcess = boardArr
}
