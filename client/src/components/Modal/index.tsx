import Button from '@client/components/Button'
import Header from '@client/components/Header'
import { ReactNode } from 'react'
import s from './modal.module.scss'

export default function Modal({ children, title, onCloseModal }: IModalProps) {
	return (
		<div className={s.overlay} onClick={onCloseModal}>
			<div className={s.modal} onClick={e => e.stopPropagation()}>
				<Header title={title}>
					<Button
						text={'x'}
						style={{ width: 25, height: 25, borderColor: 'orangered' }}
						action={onCloseModal}
					/>
				</Header>
				<div className={s.children}>{children}</div>
			</div>
		</div>
	)
}

interface IModalProps {
	children: ReactNode
	title: string
	onCloseModal: () => void
}
