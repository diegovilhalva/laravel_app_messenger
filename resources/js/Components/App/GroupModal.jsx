
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

const GroupModal = ({ show = false, onClose = () => { } }) => {
    const page = usePage()
    const conversations = page.props.conversations
    const { on, emit } = useEventBus()
    const [group, setGroup] = useState({})
    const { data, setData, processing, reset, post, put, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    })
    const users = conversations.filter((c) => !c.is_group)
    const createOrUpdatedgroup = (e) => {
        e.preventDefault()
        if (group.id) {
            put(route('group.update', group.id), {
                onSuccess: () => {
                    closeModal()
                    emit('toast.show', `Grupo "${data.name} atualizado"`)
                }
            })
            return;
        }
        post(route('group.store'), {
            onSuccess: () => {
                emit('toast.show', `Grupo "${data.name}" criado`)
            }
        })
    }
    const closeModal = () => {
        reset()
        onClose()
    }
    useEffect(() => {
        return on('GroupModal.show', (group) => {
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.users.filter((u) => group.owner_id !== u.id).map((u) => u.id)
            })
            setGroup(group)
        })
    }, [on])
    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={createOrUpdatedgroup} className='p-3 overflow-y-auto '  >
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {group.id ? 'Editar Grupo' : 'Criar novo Grupo'}
                </h2>
                <div className="mt-8">
                    <InputLabel htmlFor='name' value='Nome' />
                    <TextInput id="name" className="mt-1 block w-full" value={data.name}
                        disabled={!!group.id} onChange={(e) => setData('name', e.target.value)} required isFocused />
                    <InputError className='mt-2' message={errors.name} />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="description" value={'Descrição'}/>
                    <TextAreaInput id="description" rows="3" className="mt-1 block w-full" value={data.description || ""} onChange={(e) => setData('description',e.target.value)}/>
                    <InputError className='mt-2' message={errors.description} />
                </div>
                <div className="mt-4">
                    <InputLabel value="Selecionar Usuários" />
                    <UserPicker  value={users.filter((u) =>  group.owner_id !== u.id && data.user_ids.includes(u.id) ) || []}/>
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton className='ms-3' disabled={processing}>
                        {group.id ? 'Atualizar' : 'Criar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>

    )
}

export default GroupModal