<?php

// =====================================================
// api/core/Validator.php
// =====================================================

class Validator {
    
    private $errors = [];
    
    public function required($value, $field) {
        if (empty($value) && $value !== '0') {
            $this->errors[$field] = "El campo $field es requerido";
            return false;
        }
        return true;
    }
    
    public function email($value, $field) {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = "El campo $field debe ser un email válido";
            return false;
        }
        return true;
    }
    
    public function min($value, $min, $field) {
        if (strlen($value) < $min) {
            $this->errors[$field] = "El campo $field debe tener al menos $min caracteres";
            return false;
        }
        return true;
    }
    
    public function max($value, $max, $field) {
        if (strlen($value) > $max) {
            $this->errors[$field] = "El campo $field no debe exceder $max caracteres";
            return false;
        }
        return true;
    }
    
    public function numeric($value, $field) {
        if (!is_numeric($value)) {
            $this->errors[$field] = "El campo $field debe ser numérico";
            return false;
        }
        return true;
    }
    
    public function date($value, $field) {
        $d = DateTime::createFromFormat('Y-m-d', $value);
        if (!$d || $d->format('Y-m-d') !== $value) {
            $this->errors[$field] = "El campo $field debe ser una fecha válida (Y-m-d)";
            return false;
        }
        return true;
    }
    
    public function inArray($value, $array, $field) {
        if (!in_array($value, $array)) {
            $this->errors[$field] = "El campo $field tiene un valor inválido";
            return false;
        }
        return true;
    }
    
    public function hasErrors() {
        return !empty($this->errors);
    }
    
    public function getErrors() {
        return $this->errors;
    }
    
    public function clearErrors() {
        $this->errors = [];
    }
}

?>