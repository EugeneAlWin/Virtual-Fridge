import { ChangeEventHandler } from 'react'
import s from './select.module.scss'

export default function Select({
	label,
	onChange,
	value,
	options,
}: ISelectProps) {
	return (
		<div className={s.container}>
			<p className={s.label}>{label}</p>
			<select value={value} className={s.select} onChange={onChange}>
				{options.map(option => (
					<option
						value={option.value}
						className={s.option}
						key={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)
}

interface ISelectProps {
	label: string
	value: string
	onChange: ChangeEventHandler<HTMLSelectElement>
	options: { label: string; value: string }[]
}
