import { FilterIcon } from "../../../../components/icons/FilterIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import { MONTHS } from "../../../../../app/config/constants";
import { SliderOption } from "./SliderOption";
import { SliderNavigation } from "./SliderNavigation";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { CategoryIcon } from "../../../../components/icons/categories/CategoryIcon";
import { useTransactionsController } from "./useTransactionsController";
import { cn } from "../../../../../app/utils/cn";
import { Spinner } from "../../../../components/Spinner";
import emprtyStateImage from "../../../../../assets/empty-state.svg";
import { TransactionTypeDropdown } from "./TransactionTypeDropdown";
import { FiltersModal } from "./FiltersModal";
import { formatDate } from "../../../../../app/utils/formatDate";
import { EditTransactionModal } from "../../modals/EditTransactionModal";

export function Transactions() {
  const {
    areValuesVisible,
    isInitialLoading,
    transactions,
    isLoading,
    isFiltersModalOpen,
    handleOpenFiltersModal,
    handleCloseFiltersModal,
    filters,
    handleChangeFilters,
    handleApplyFilters,
    handleCloseEditTransactionModal,
    handleOpenEditTransactionModal,
    isEditModalOpen,
    transactionBeingEdited
  } = useTransactionsController();
  return (
    <div className="bg-gray-100 rounded-2xl w-full h-full p-10 flex flex-col">

      {isInitialLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      )}
      {!isInitialLoading && (
        <>
          <FiltersModal
            onApplyFilters={handleApplyFilters}
            open={isFiltersModalOpen}
            onClose={handleCloseFiltersModal}
          />
          <header className="">
            <div className="flex justify-between items-center">
              <TransactionTypeDropdown
                selectedType={filters.type}
                onSelect={handleChangeFilters('type')}
              />
              <button onClick={handleOpenFiltersModal}>
                <FilterIcon />
              </button>
            </div>
            <div className="mt-6 relative">
              <Swiper
                slidesPerView={3}
                centeredSlides
                initialSlide={filters.month}
                onSlideChange={swiper => {
                  handleChangeFilters('month')(swiper.realIndex);
                }}
              >
                <SliderNavigation />
                {MONTHS.map((month, index) => (
                  <SwiperSlide key={month}>
                    {({ isActive }) => (
                      <SliderOption isActive={isActive} month={month} index={index} />
                    )}
                  </SwiperSlide>
                ))}

              </Swiper>
            </div>
          </header>

          <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner />
              </div>
            )}

            {(transactions.length === 0 && !isLoading) && (
              <div className="flex flex-col items-center justify-center h-full">
                <>
                  <img src={emprtyStateImage} alt="empty-state" />
                  <p className="text-gray-700">Não encontramos nenhuma transação!</p>
                </>
              </div>
            )}
            {(!isLoading && transactions.length > 0) &&
              (
                <>
                  {transactionBeingEdited && <EditTransactionModal
                    transaction={transactionBeingEdited}
                    open={isEditModalOpen}
                    onClose={handleCloseEditTransactionModal}
                  />}

                  {transactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="bg-white rounded-2xl p-4 flex items-center justify-between gap-4"
                      role="button"
                      onClick={() => handleOpenEditTransactionModal(transaction)}
                    >
                      <div className=" flex-1 flex items-center gap-3">
                        <CategoryIcon
                          type={transaction.type === 'EXPENSE' ? 'expense' : 'income'}
                          category={transaction.category?.icon}
                        />
                        <div>
                          <strong
                            className="font-bold tracking-[-0.5px] block">
                            {transaction.name}
                          </strong>
                          <span
                            className="text-sm text-gray-600">
                            {formatDate(new Date(transaction.date))}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          " tracking-[-0.5px] font-medium",
                          !areValuesVisible && 'blur-sm',
                          transaction.type === 'EXPENSE' ? 'text-red-800' : 'text-green-800'
                        )}>
                        {transaction.type === 'EXPENSE' ? '-' : '+'}
                        {formatCurrency(transaction.value)}
                      </span>
                    </div>

                  ))}
                </>
              )
            }
          </div>
        </>
      )}
    </div>
  );
}