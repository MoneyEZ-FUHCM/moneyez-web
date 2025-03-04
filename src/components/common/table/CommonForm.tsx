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
  readonly form: any;
  readonly colSpan?: number;
}

export function CommonForm({
  fields,
  initialValues,
  form,
  colSpan = 12,
}: CommonFormProps) {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" initialValues={initialValues}>
      <Row gutter={16}>
        {fields.map(
          ({ name, label, component, rules, colSpan: fieldColSpan }) => (
            <Col span={fieldColSpan ?? colSpan} key={name}>
              <Form.Item name={name} label={label} rules={rules}>
                {component}
              </Form.Item>
            </Col>
          ),
        )}
      </Row>
    </Form>
  );
}
