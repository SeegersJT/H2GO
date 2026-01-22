import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/custom/CustomButton'
import CustomLabel from '@/components/ui/custom/CustomLabel'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { Utils } from '@/utils/Utils'
import { ArrowLeft, Save } from 'lucide-react'

function CustomersInsert({
  insertCustomerData,
  customerDataErrors,
  canInsertCustomerData,
  showErrors,
  customerInsertLoading,
  onInsertCustomerDataChange,
  onInsertCustomerData,
  handleOnNavigateToCustomerHome,
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <CustomButton variant="ghost" size="icon" onClick={handleOnNavigateToCustomerHome}>
            <ArrowLeft className="h-5 w-5" />
          </CustomButton>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
            <p className="text-muted-foreground">Create a new customer account</p>
          </div>
        </div>
      </div>

      {/* Customer Form */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
          <CardDescription>Enter the customer's information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomLabel
              title="Name"
              secondaryTitle="Required *"
              placeholder="Enter Customer Name"
              value={insertCustomerData?.name}
              error={showErrors && !Utils.isEmptyString(customerDataErrors?.name)}
              errorMessage={showErrors && customerDataErrors?.name}
              onChange={(value) => onInsertCustomerDataChange('name', value)}
            />
            <CustomLabel
              title="Surname"
              secondaryTitle="Required *"
              placeholder="Enter Customer Surname"
              value={insertCustomerData?.surname}
              error={showErrors && !Utils.isEmptyString(customerDataErrors?.surname)}
              errorMessage={showErrors && customerDataErrors?.surname}
              onChange={(value) => onInsertCustomerDataChange('surname', value)}
            />
            <CustomLabel
              title="ID Number"
              secondaryTitle="Required *"
              placeholder="Enter Customer ID Number"
              value={insertCustomerData?.id_number}
              error={showErrors && !Utils.isEmptyString(customerDataErrors?.id_number)}
              errorMessage={showErrors && customerDataErrors?.id_number}
              onChange={(value) => onInsertCustomerDataChange('id_number', value)}
            />
            <CustomSelect
              title="Gender"
              secondaryTitle="Required *"
              placeholder="Select Customer Gender"
              value={insertCustomerData?.gender}
              options={[
                {
                  label: 'Male',
                  value: 'Male',
                },
                {
                  label: 'Female',
                  value: 'Female',
                },
              ]}
              onChange={(value) => onInsertCustomerDataChange('gender', value)}
            />
            <CustomLabel
              title="Email Address"
              secondaryTitle="Required *"
              placeholder="Enter Customer Email Address"
              value={insertCustomerData?.email_address}
              error={showErrors && !Utils.isEmptyString(customerDataErrors?.email_address)}
              errorMessage={showErrors && customerDataErrors?.email_address}
              onChange={(value) => onInsertCustomerDataChange('email_address', value)}
            />
            <CustomLabel
              title="Mobile Number"
              secondaryTitle="Required *"
              placeholder="Enter Customer Mobile Number"
              value={insertCustomerData?.mobile_number}
              error={showErrors && !Utils.isEmptyString(customerDataErrors?.mobile_number)}
              errorMessage={showErrors && customerDataErrors?.mobile_number}
              onChange={(value) => onInsertCustomerDataChange('mobile_number', value)}
            />

            <CustomSelect
              title="Branch"
              secondaryTitle="Required *"
              placeholder="Select Customer Branch"
              value={insertCustomerData?.branch_id}
              options={[
                {
                  label: 'H2GO - Headoffice',
                  value: '689de0056a6475103c77697d',
                },
              ]}
              onChange={(value) => onInsertCustomerDataChange('branch_id', value)}
            />
            <CustomLabel
              title="Password"
              secondaryTitle="Required *"
              placeholder="Enter Customer Password"
              disabled
              value={insertCustomerData?.password}
              error={showErrors && !Utils.isEmptyString(customerDataErrors?.password)}
              errorMessage={showErrors && customerDataErrors?.password}
              onChange={(value) => onInsertCustomerDataChange('password', value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton variant="outline" onClick={handleOnNavigateToCustomerHome}>
              Cancel
            </CustomButton>
            <CustomButton loading={customerInsertLoading} disabled={showErrors && !canInsertCustomerData} onClick={onInsertCustomerData}>
              <Save className="mr-2 h-4 w-4" />
              Create Customer
            </CustomButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomersInsert
