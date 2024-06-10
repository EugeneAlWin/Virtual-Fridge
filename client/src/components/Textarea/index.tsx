import { ChangeEventHandler, useState } from 'react'
import s from './textarea.module.scss'

export default function Textarea(props: ITextAreaProps) {
	const [isFocused, setIsFocused] = useState(false)
	return (
		<div>
			<p className={s.label}>{props.label}</p>
			<textarea
				value={props.value}
				onChange={props.onChange}
				className={`${s.textarea} ${isFocused && s.areaActive}`}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
		</div>
	)
}

interface ITextAreaProps {
	label: string
	onChange: ChangeEventHandler<HTMLTextAreaElement>
	value: string
}
