import IconButton from '@/components/icon-button'
import TooltipPro from '@/components/tooltip-pro'
import { HISTORY_LABEL } from '@/entities/history'
import Like from '@/assets/icons/like-default.svg?react'
import Liked from '@/assets/icons/like.svg?react'
import Dislike from '@/assets/icons/dislike-default.svg?react'

interface LikeIconProps {
  className?: string
  label?: HISTORY_LABEL
  onClick?: (label: HISTORY_LABEL) => void
}

const LikeIcon: React.FC<LikeIconProps> = ({ label, onClick }) => {
  const onLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(label === HISTORY_LABEL.LIKED ? HISTORY_LABEL.DEFAULT : HISTORY_LABEL.LIKED)
  }

  const onDisLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(label === HISTORY_LABEL.DISLIKE ? HISTORY_LABEL.DEFAULT : HISTORY_LABEL.DISLIKE)
  }

  return (
    <>
      {label === HISTORY_LABEL.DISLIKE
        ? null
        : (
          <TooltipPro message='Like'>
            <IconButton
              Icon={label === HISTORY_LABEL.LIKED ? Liked : Like}
              onClick={onLikeClick}
            />
          </TooltipPro>
        )}
      {label === HISTORY_LABEL.LIKED
        ? null
        : (
          <TooltipPro message='Dislike'>
            <IconButton
              Icon={Dislike}
              onClick={onDisLikeClick}
            />
          </TooltipPro>
        )}
    </>
  )
}

export default LikeIcon
