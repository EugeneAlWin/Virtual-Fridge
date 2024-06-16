import { ReactNode } from 'react'
import s from './header.module.scss'

export default function Header({ children, title }: IHeaderProps) {
	return (
		<div className={s.container}>
			<h1 className={s.header}>{title}</h1>
			<div className={s.childrenContainer}>{children}</div>
		</div>
	)
}

interface IHeaderProps {
	title: string
	children?: ReactNode
}
