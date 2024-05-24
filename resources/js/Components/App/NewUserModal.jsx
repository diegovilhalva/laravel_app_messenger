
import InputError from '@/Components/InputError'
import InputLabel from '../InputLabel'
import Modal from '../Modal'
import TextInput from '../TextInput'
import SecondaryButton from '../SecondaryButton'
import PrimaryButton from '../PrimaryButton'
import { useForm, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import TextAreaInput from '../TextAreaInput'
import UserPicker from './UserPicker'
import { useEventBus } from "@/EventBus"
import Checkbox from '../Checkbox'

const NewUserModal = ({ show = false, onClose = () => { } }) => {

  const { emit } = useEventBus()
  const [group, setGroup] = useState({})
  const { data, setData, processing, reset, post, errors } = useForm({
    name: "",
    email: "",
    is_admin: false,
  })

  const submit = (e) => {
    e.preventDefault()

    post(route('user.store'), {
      onSuccess: () => {
        emit('toast.show', `Usuário "${data.name}" criado`)
        closeModal()
      }
    })
  }
  const closeModal = () => {
    reset()
    onClose()
  }

  return (
    <Modal show={show} onClose={closeModal}>
      <form onSubmit={submit} className='p-3 overflow-y-auto '  >
        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
          Criar novo usuário
        </h2>
        <div className="mt-8">
          <InputLabel htmlFor='name' value='Nome' />
          <TextInput id="name" className="mt-1 block w-full" value={data.name}
            onChange={(e) => setData('name', e.target.value)} required isFocused />
          <InputError className='mt-2' message={errors.name} />
        </div>
        <div className="mt-4">
          <InputLabel htmlFor="email" value={'Email'} />
          <TextInput id="email" className="mt-1 block w-full" value={data.email}
            onChange={(e) => setData('email', e.target.value)} required />
          <InputError className='mt-2' message={errors.email} />
        </div>
        <div className="mt-4">
          <InputLabel value="Tipo de usuaŕio" />
          <label className="flex items-center">

            <Checkbox name={'is_admin'} checked={data.is_admin} onChange={(e) => setData('is_admin', e.target.checked)} />
            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Admin</span>
          </label>
          <InputError className='mt-2' message={errors.is_admin} />
        </div>
        <div className="mt-6 flex justify-end">
          <SecondaryButton onClick={closeModal}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton className='ms-3' disabled={processing}>
            Criar
          </PrimaryButton>
        </div>
      </form>
    </Modal>

  )
}

export default NewUserModal