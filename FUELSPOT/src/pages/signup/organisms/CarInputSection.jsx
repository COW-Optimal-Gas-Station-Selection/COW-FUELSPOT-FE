import { Combobox, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { getBrands, getModels } from '../../../api/carService'
import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'

function CarInputSection({ brand, model, onBrandChange, onModelChange, error }) {
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [loadingBrands, setLoadingBrands] = useState(false)
    const [loadingModels, setLoadingModels] = useState(false)
    const [brandQuery, setBrandQuery] = useState('')
    const [modelQuery, setModelQuery] = useState('')

    // 브랜드 목록 조회
    useEffect(() => {
        setLoadingBrands(true)
        getBrands()
            .then(res => {
                const brandList = res.brands || []
                setBrands(brandList)
            })
            .catch(err => console.error('Failed to fetch brands:', err))
            .finally(() => setLoadingBrands(false))
    }, [])

    // 브랜드 선택 시 모델 목록 조회
    useEffect(() => {
        if (brand) {
            setLoadingModels(true)
            getModels(brand)
                .then(res => {
                    setModels(res || [])
                })
                .catch(err => console.error('Failed to fetch models:', err))
                .finally(() => setLoadingModels(false))
        } else {
            setModels([])
        }
    }, [brand])

    const filteredBrands = brandQuery === ''
        ? brands
        : brands.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()))

    const filteredModels = modelQuery === ''
        ? models
        : models.filter((m) => m.modelName.toLowerCase().includes(modelQuery.toLowerCase()))

    return (
        <div className="space-y-4 mb-6">
            {/* 브랜드 선택 (Combobox) */}
            <div>
                <Label className="text-gray-700 font-bold mb-2 block">자동차 브랜드</Label>
                <div className="relative">
                    <Combobox value={brand} onChange={onBrandChange}>
                        <div className="relative">
                            <Combobox.Input
                                className="w-full bg-white border border-gray-100 rounded-xl py-3.5 px-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-200 text-sm font-bold text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                                placeholder={loadingBrands ? '로딩 중...' : '브랜드를 입력하거나 선택하세요'}
                                displayValue={(b) => b}
                                onChange={(event) => setBrandQuery(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    <path d="M7 8l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setBrandQuery('')}
                        >
                            <Combobox.Options className="absolute z-20 mt-2 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-gray-50/50">
                                {filteredBrands.length === 0 && brandQuery !== '' ? (
                                    <div className="relative cursor-default select-none py-3 px-4 text-gray-400 text-xs">
                                        검색 결과가 없습니다.
                                    </div>
                                ) : (
                                    filteredBrands.map((b) => (
                                        <Combobox.Option
                                            key={b}
                                            className={({ active }) => `${active ? 'text-blue-900 bg-blue-50/60' : 'text-gray-700'} cursor-pointer select-none relative py-3.5 px-4 transition-colors duration-150`}
                                            value={b}
                                        >
                                            {({ selected }) => (
                                                <span className={`${selected ? 'font-bold text-blue-600' : 'font-medium'} block truncate`}>{b}</span>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </Combobox>
                </div>
            </div>

            {/* 모델 선택 (Combobox) */}
            <div>
                <Label className="text-gray-700 font-bold mb-2 block">자동차 모델</Label>
                <div className="relative">
                    <Combobox value={model} onChange={onModelChange} disabled={!brand}>
                        <div className="relative">
                            <Combobox.Input
                                className={`w-full border rounded-xl py-3.5 px-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm text-sm font-bold flex items-center justify-between placeholder:font-normal ${!brand ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed placeholder:text-gray-300' : 'bg-white border-gray-100 text-gray-700 hover:border-blue-200 placeholder:text-gray-400'}`}
                                placeholder={!brand ? '브랜드를 먼저 선택해주세요' : loadingModels ? '로딩 중...' : '모델명을 입력하거나 선택하세요'}
                                displayValue={(m) => m?.modelName || ''}
                                onChange={(event) => setModelQuery(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    <path d="M7 8l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setModelQuery('')}
                        >
                            <Combobox.Options className="absolute z-20 mt-2 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-gray-50/50">
                                {filteredModels.length === 0 && modelQuery !== '' ? (
                                    <div className="relative cursor-default select-none py-3 px-4 text-gray-400 text-xs">
                                        검색 결과가 없습니다.
                                    </div>
                                ) : (
                                    filteredModels.map((m) => (
                                        <Combobox.Option
                                            key={m.id}
                                            className={({ active }) => `${active ? 'text-blue-900 bg-blue-50/60' : 'text-gray-700'} cursor-pointer select-none relative py-3.5 px-4 transition-colors duration-150`}
                                            value={m}
                                        >
                                            {({ selected }) => (
                                                <div className="flex flex-col">
                                                    <span className={`${selected ? 'font-bold text-blue-600' : 'font-medium'} block truncate`}>{m.modelName}</span>
                                                    <span className="text-[10px] text-gray-400">{m.fuelType} | 연비: {m.fuelEfficiency}km/L</span>
                                                </div>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </Combobox>
                </div>
            </div>

            <ErrorMessage>{error}</ErrorMessage>
        </div>
    )
}

export default CarInputSection
