import { CSSProperties } from 'react'
import s from './button.module.scss'

export default function Button({
	action,
	text,
	style,
	disabled,
}: IButtonProps) {
	return (
		<button
			type='button'
			onClick={action}
			className={s.button}
			style={style}
			disabled={disabled}>
			{text}
		</button>
	)
}

interface IButtonProps {
	text: string
	action: () => void
	style?: CSSProperties
	disabled?: boolean
}
