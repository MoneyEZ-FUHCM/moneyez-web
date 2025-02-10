import { Col, Form, Row } from "antd";
import { useEffect } from "react";

interface FieldConfig {
  name: string;
  label: string;
  component: React.ReactNode;
  rules?: object[];
  colSpan?: number;
}

interface CommonFormProps {
  readonly fields: readonly FieldConfig[];
  readonly initialValues?: Readonly<Record<string, any>>;
  // readonly onSubmit: (values: any) => void;
  readonly form: any;
}

export function CommonForm({
  fields,
  initialValues,
  // onSubmit,
  form,
}: CommonFormProps) {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      // onFinish={(values) => onSubmit(values)}
      initialValues={initialValues}
    >
      <Row gutter={16}>
        {fields.map(({ name, label, component, rules, colSpan = 12 }) => (
          <Col span={colSpan} key={name}>
            <Form.Item name={name} label={label} rules={rules}>
              {component}
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Form>
  );
}
