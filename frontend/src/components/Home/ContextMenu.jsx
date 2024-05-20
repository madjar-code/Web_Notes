import './ContextMenu.css'


const ContextMenu = ({
  rightClickItem,
  positionX,
  positionY,
  isToggled,
  buttons,
  contextMenuRef
}) => {
  return (
    <menu
      style={{
        top: positionY + 1 + 'px',
        left: positionX + 1 + 'px'
      }}
      className={`context-menu ${isToggled ? 'active': ''}`}
      ref={contextMenuRef}
    >
      {
        buttons.map((button, index) => {
          if (!button) return null
          function handleClick(e) {
            e.stopPropagation()
            console.log(rightClickItem)
            button.onClick(e, rightClickItem)
          }

          if (button.isSpacer) return <hr key={index}></hr>

          return (
            <button
              onClick={handleClick}
              key={index}
              className='context-menu-button'
            >
              <span style={{
                  color: button.text === 'Delete' ? '#F12727' : 'inherit'
                }}
              >
                {button.text}
              </span>
              {button.icon}
            </button>
          )
        })
      }
    </menu>
  )
}

export default ContextMenu